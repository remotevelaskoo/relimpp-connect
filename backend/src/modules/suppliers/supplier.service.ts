import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { formatCnpj } from '../../core/validation/cnpj.util';
import {
  ApproveSupplierDto,
  CreateSupplierDto,
  SupplierReasonDto,
  UpdateSupplierDto,
} from './dto/supplier.dto';
import { SUP_STATUS, SupStatus } from './supplier.status';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  list(companyId?: string) {
    return this.prisma.supplier.findMany({
      where: companyId ? { companyId } : {},
      orderBy: { createdAt: 'desc' },
      include: { company: { select: { id: true, name: true } } },
    });
  }

  async get(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true } },
        events: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!supplier) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }
    return supplier;
  }

  async create(dto: CreateSupplierDto, actorId?: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });
    if (!company) {
      throw new NotFoundException('Empresa informada não existe.');
    }
    try {
      const created = await this.prisma.supplier.create({
        data: {
          companyId: dto.companyId,
          name: dto.name,
          tradeName: dto.tradeName ?? null,
          cnpj: dto.cnpj ? formatCnpj(dto.cnpj) : null,
          email: dto.email ?? null,
          phone: dto.phone ?? null,
          status: SUP_STATUS.PRE_REGISTERED,
          createdBy: actorId ?? null,
          updatedBy: actorId ?? null,
          events: {
            create: {
              type: 'CREATED',
              message: 'Fornecedor pré-cadastrado.',
              actorId,
            },
          },
        },
      });
      return this.get(created.id);
    } catch (error) {
      throw this.mapKnownErrors(error);
    }
  }

  async update(id: string, dto: UpdateSupplierDto, actorId?: string) {
    const supplier = await this.getRaw(id);
    if (supplier.status === SUP_STATUS.BLOCKED) {
      throw new BadRequestException(
        'Fornecedor bloqueado não pode ser editado. Reative antes de alterar os dados.',
      );
    }

    const data: Prisma.SupplierUpdateInput = {
      updatedBy: actorId ?? null,
      version: { increment: 1 },
    };
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.tradeName !== undefined) data.tradeName = dto.tradeName || null;
    if (dto.cnpj !== undefined) data.cnpj = dto.cnpj ? formatCnpj(dto.cnpj) : null;
    if (dto.email !== undefined) data.email = dto.email || null;
    if (dto.phone !== undefined) data.phone = dto.phone || null;
    if (dto.active !== undefined) data.active = dto.active;

    try {
      await this.prisma.supplier.update({ where: { id }, data });
      return this.get(id);
    } catch (error) {
      throw this.mapKnownErrors(error);
    }
  }

  async remove(id: string) {
    const supplier = await this.getRaw(id);
    if (supplier.status !== SUP_STATUS.PRE_REGISTERED) {
      throw new ConflictException(
        'Só é possível excluir fornecedores em pré-cadastro. Para os demais, use inativar.',
      );
    }
    await this.prisma.supplier.delete({ where: { id } });
    return { deleted: true };
  }

  async submitForReview(id: string, actorId?: string) {
    const supplier = await this.getRaw(id);
    this.ensureStatus(supplier.status as SupStatus, [SUP_STATUS.PRE_REGISTERED]);
    return this.transition(id, SUP_STATUS.UNDER_REVIEW, actorId, {
      type: 'SUBMITTED_FOR_REVIEW',
      message: 'Fornecedor enviado para homologação.',
    });
  }

  async approve(id: string, dto: ApproveSupplierDto, actorId?: string) {
    const supplier = await this.getRaw(id);
    this.ensureStatus(supplier.status as SupStatus, [SUP_STATUS.UNDER_REVIEW]);
    const status = dto.restricted ? SUP_STATUS.RESTRICTED : SUP_STATUS.APPROVED;
    return this.transition(id, status, actorId, {
      type: dto.restricted ? 'APPROVED_WITH_RESTRICTION' : 'APPROVED',
      message: dto.restricted
        ? 'Fornecedor homologado com restrição.'
        : 'Fornecedor homologado.',
    });
  }

  async suspend(id: string, dto: SupplierReasonDto, actorId?: string) {
    const supplier = await this.getRaw(id);
    this.ensureStatus(supplier.status as SupStatus, [
      SUP_STATUS.APPROVED,
      SUP_STATUS.RESTRICTED,
    ]);
    return this.transition(id, SUP_STATUS.SUSPENDED, actorId, {
      type: 'SUSPENDED',
      message: `Fornecedor suspenso: ${dto.reason}`,
    });
  }

  async block(id: string, dto: SupplierReasonDto, actorId?: string) {
    const supplier = await this.getRaw(id);
    this.ensureStatus(supplier.status as SupStatus, [
      SUP_STATUS.PRE_REGISTERED,
      SUP_STATUS.UNDER_REVIEW,
      SUP_STATUS.APPROVED,
      SUP_STATUS.RESTRICTED,
      SUP_STATUS.SUSPENDED,
    ]);
    return this.transition(id, SUP_STATUS.BLOCKED, actorId, {
      type: 'BLOCKED',
      message: `Fornecedor bloqueado: ${dto.reason}`,
    });
  }

  async reactivate(id: string, actorId?: string) {
    const supplier = await this.getRaw(id);
    this.ensureStatus(supplier.status as SupStatus, [
      SUP_STATUS.SUSPENDED,
      SUP_STATUS.BLOCKED,
    ]);
    return this.transition(id, SUP_STATUS.APPROVED, actorId, {
      type: 'REACTIVATED',
      message: 'Fornecedor reativado (homologado).',
    });
  }

  async inactivate(id: string, dto: SupplierReasonDto, actorId?: string) {
    const supplier = await this.getRaw(id);
    this.ensureStatus(supplier.status as SupStatus, [
      SUP_STATUS.PRE_REGISTERED,
      SUP_STATUS.UNDER_REVIEW,
      SUP_STATUS.APPROVED,
      SUP_STATUS.RESTRICTED,
      SUP_STATUS.SUSPENDED,
    ]);
    return this.transition(id, SUP_STATUS.INACTIVE, actorId, {
      type: 'INACTIVATED',
      message: `Fornecedor inativado: ${dto.reason}`,
    });
  }

  private async getRaw(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }
    return supplier;
  }

  private ensureStatus(current: SupStatus, allowed: SupStatus[]) {
    if (!allowed.includes(current)) {
      throw new BadRequestException(
        `Ação não permitida para o status atual (${current}).`,
      );
    }
  }

  private async transition(
    id: string,
    status: SupStatus,
    actorId: string | undefined,
    event: { type: string; message: string },
  ) {
    await this.prisma.supplier.update({
      where: { id },
      data: {
        status,
        updatedBy: actorId ?? null,
        version: { increment: 1 },
        events: {
          create: { type: event.type, message: event.message, actorId },
        },
      },
    });
    return this.get(id);
  }

  private mapKnownErrors(error: unknown): unknown {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return new ConflictException(
        'Já existe um fornecedor com este CNPJ nesta empresa.',
      );
    }
    return error;
  }
}
