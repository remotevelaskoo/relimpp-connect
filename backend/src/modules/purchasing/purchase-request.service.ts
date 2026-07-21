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

@Injectable()
export class PurchaseRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId?: string) {
    const items = await this.prisma.purchaseRequest.findMany({
      where: companyId ? { companyId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        requester: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
        _count: { select: { items: true } },
      },
    });
    return items.map((r) => ({ ...r, number: formatRequestNumber(r.seq) }));
  }

  async get(id: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        items: true,
        events: { orderBy: { createdAt: 'asc' } },
        requester: { select: { id: true, name: true, email: true } },
        company: { select: { id: true, name: true } },
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

    const created = await this.prisma.purchaseRequest.create({
      data: {
        companyId: dto.companyId,
        requesterId: actorId,
        justification: dto.justification,
        priority: dto.priority ?? 'medium',
        status: PR_STATUS.DRAFT,
        createdBy: actorId,
        updatedBy: actorId,
        items: {
          create: dto.items.map((i) => ({
            description: i.description,
            specification: i.specification ?? null,
            quantity: i.quantity,
            unit: i.unit,
            estimatedPrice: i.estimatedPrice ?? null,
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

    await this.prisma.$transaction(async (tx) => {
      await tx.purchaseRequest.update({
        where: { id },
        data: {
          justification: dto.justification ?? request.justification,
          priority: dto.priority ?? request.priority,
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
