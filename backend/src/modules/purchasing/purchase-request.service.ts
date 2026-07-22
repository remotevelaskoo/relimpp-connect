import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  CancelDto,
  CreatePurchaseRequestDto,
  DecisionDto,
  UpdatePurchaseRequestDto,
} from './dto/purchase-request.dto';
import { formatRequestNumber, PR_STATUS, PrStatus } from './purchase-request.status';

const scopeInclude = {
  requester: { select: { id: true, name: true, email: true } },
  company: { select: { id: true, name: true } },
  branch: { select: { id: true, name: true } },
  department: { select: { id: true, name: true } },
  project: { select: { id: true, name: true } },
  costCenter: { select: { id: true, name: true } },
  category: { select: { id: true, name: true } },
};

@Injectable()
export class PurchaseRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId?: string) {
    const items = await this.prisma.purchaseRequest.findMany({
      where: companyId ? { companyId } : {},
      orderBy: { createdAt: 'desc' },
      include: { ...scopeInclude, _count: { select: { items: true } } },
    });
    return items.map((r) => ({ ...r, number: formatRequestNumber(r.seq) }));
  }

  async get(id: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        items: true,
        events: { orderBy: { createdAt: 'asc' } },
        ...scopeInclude,
      },
    });
    if (!request) {
      throw new NotFoundException('Solicitação não encontrada.');
    }
    return { ...request, number: formatRequestNumber(request.seq) };
  }

  async create(dto: CreatePurchaseRequestDto, actorId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });
    if (!company) {
      throw new NotFoundException('Empresa informada não existe.');
    }
    await this.validateOrgScope(dto, dto.companyId);

    const created = await this.prisma.purchaseRequest.create({
      data: {
        companyId: dto.companyId,
        requesterId: actorId,
        justification: dto.justification,
        priority: dto.priority ?? 'medium',
        status: PR_STATUS.DRAFT,
        branchId: dto.branchId ?? null,
        departmentId: dto.departmentId ?? null,
        projectId: dto.projectId ?? null,
        costCenterId: dto.costCenterId ?? null,
        categoryId: dto.categoryId ?? null,
        criticality: dto.criticality ?? null,
        confidential: dto.confidential ?? false,
        createdBy: actorId,
        updatedBy: actorId,
        items: {
          create: dto.items.map((i) => ({
            description: i.description,
            specification: i.specification ?? null,
            quantity: i.quantity,
            unit: i.unit,
            estimatedPrice: i.estimatedPrice ?? null,
            neededDate: i.neededDate ? new Date(i.neededDate) : null,
            deliveryLocation: i.deliveryLocation ?? null,
          })),
        },
        events: {
          create: {
            type: 'CREATED',
            message: 'Solicitação criada como rascunho.',
            actorId,
          },
        },
      },
    });
    return this.get(created.id);
  }

  async update(id: string, dto: UpdatePurchaseRequestDto, actorId: string) {
    const request = await this.getRaw(id);
    this.ensureStatus(request.status as PrStatus, [
      PR_STATUS.DRAFT,
      PR_STATUS.RETURNED,
    ]);
    await this.validateOrgScope(dto, request.companyId);

    await this.prisma.$transaction(async (tx) => {
      await tx.purchaseRequest.update({
        where: { id },
        data: {
          justification: dto.justification ?? request.justification,
          priority: dto.priority ?? request.priority,
          branchId: dto.branchId !== undefined ? dto.branchId : request.branchId,
          departmentId:
            dto.departmentId !== undefined ? dto.departmentId : request.departmentId,
          projectId: dto.projectId !== undefined ? dto.projectId : request.projectId,
          costCenterId:
            dto.costCenterId !== undefined ? dto.costCenterId : request.costCenterId,
          categoryId: dto.categoryId !== undefined ? dto.categoryId : request.categoryId,
          criticality: dto.criticality !== undefined ? dto.criticality : request.criticality,
          confidential:
            dto.confidential !== undefined ? dto.confidential : request.confidential,
          updatedBy: actorId,
          version: { increment: 1 },
        },
      });
      if (dto.items) {
        await tx.purchaseRequestItem.deleteMany({ where: { requestId: id } });
        await tx.purchaseRequestItem.createMany({
          data: dto.items.map((i) => ({
            requestId: id,
            description: i.description,
            specification: i.specification ?? null,
            quantity: i.quantity,
            unit: i.unit,
            estimatedPrice: i.estimatedPrice ?? null,
            neededDate: i.neededDate ? new Date(i.neededDate) : null,
            deliveryLocation: i.deliveryLocation ?? null,
          })),
        });
      }
    });
    return this.get(id);
  }

  async submit(id: string, actorId: string) {
    const request = await this.getRaw(id);
    this.ensureStatus(request.status as PrStatus, [
      PR_STATUS.DRAFT,
      PR_STATUS.RETURNED,
    ]);
    return this.transition(id, PR_STATUS.SUBMITTED, actorId, {
      type: 'SUBMITTED',
      message: 'Solicitação enviada para aprovação.',
    });
  }

  async approve(id: string, actorId: string) {
    const request = await this.getRaw(id);
    this.ensureStatus(request.status as PrStatus, [PR_STATUS.SUBMITTED]);
    return this.transition(id, PR_STATUS.APPROVED, actorId, {
      type: 'APPROVED',
      message: 'Solicitação aprovada.',
    });
  }

  async reject(id: string, dto: DecisionDto, actorId: string) {
    const request = await this.getRaw(id);
    this.ensureStatus(request.status as PrStatus, [PR_STATUS.SUBMITTED]);
    return this.transition(id, PR_STATUS.REJECTED, actorId, {
      type: 'REJECTED',
      message: `Solicitação rejeitada: ${dto.justification}`,
    });
  }

  async returnForAdjustment(id: string, dto: DecisionDto, actorId: string) {
    const request = await this.getRaw(id);
    this.ensureStatus(request.status as PrStatus, [PR_STATUS.SUBMITTED]);
    return this.transition(id, PR_STATUS.RETURNED, actorId, {
      type: 'RETURNED',
      message: `Solicitação devolvida para ajuste: ${dto.justification}`,
    });
  }

  async cancel(id: string, dto: CancelDto, actorId: string) {
    const request = await this.getRaw(id);
    this.ensureStatus(request.status as PrStatus, [
      PR_STATUS.DRAFT,
      PR_STATUS.SUBMITTED,
      PR_STATUS.RETURNED,
    ]);
    return this.transition(id, PR_STATUS.CANCELLED, actorId, {
      type: 'CANCELLED',
      message: `Solicitação cancelada: ${dto.reason}`,
    });
  }

  // Garante que filial/departamento/obra/centro de custo/categoria informados
  // realmente pertencem à empresa da solicitação (ou existem, no caso de categoria).
  private async validateOrgScope(
    dto: Pick<
      CreatePurchaseRequestDto,
      'branchId' | 'departmentId' | 'projectId' | 'costCenterId' | 'categoryId'
    >,
    companyId: string,
  ) {
    const checks: Promise<void>[] = [];

    if (dto.branchId) {
      checks.push(
        this.prisma.branch
          .findUnique({ where: { id: dto.branchId } })
          .then((b) => {
            if (!b || b.companyId !== companyId) {
              throw new BadRequestException('Filial informada não pertence à empresa da solicitação.');
            }
          }),
      );
    }
    if (dto.departmentId) {
      checks.push(
        this.prisma.department
          .findUnique({ where: { id: dto.departmentId } })
          .then((d) => {
            if (!d || d.companyId !== companyId) {
              throw new BadRequestException('Departamento informado não pertence à empresa da solicitação.');
            }
          }),
      );
    }
    if (dto.projectId) {
      checks.push(
        this.prisma.project
          .findUnique({ where: { id: dto.projectId } })
          .then((p) => {
            if (!p || p.companyId !== companyId) {
              throw new BadRequestException('Obra informada não pertence à empresa da solicitação.');
            }
          }),
      );
    }
    if (dto.costCenterId) {
      checks.push(
        this.prisma.costCenter
          .findUnique({ where: { id: dto.costCenterId } })
          .then((c) => {
            if (!c || c.companyId !== companyId) {
              throw new BadRequestException('Centro de custo informado não pertence à empresa da solicitação.');
            }
          }),
      );
    }
    if (dto.categoryId) {
      checks.push(
        this.prisma.category
          .findUnique({ where: { id: dto.categoryId } })
          .then((c) => {
            if (!c || c.type !== 'purchase') {
              throw new BadRequestException('Categoria informada não existe ou não é do tipo "purchase".');
            }
          }),
      );
    }

    await Promise.all(checks);
  }

  private async getRaw(id: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('Solicitação não encontrada.');
    }
    return request;
  }

  private ensureStatus(current: PrStatus, allowed: PrStatus[]) {
    if (!allowed.includes(current)) {
      throw new BadRequestException(
        `Ação não permitida para o status atual (${current}).`,
      );
    }
  }

  private async transition(
    id: string,
    status: PrStatus,
    actorId: string,
    event: { type: string; message: string },
  ) {
    await this.prisma.purchaseRequest.update({
      where: { id },
      data: {
        status,
        updatedBy: actorId,
        version: { increment: 1 },
        events: {
          create: { type: event.type, message: event.message, actorId },
        },
      },
    });
    return this.get(id);
  }
}
