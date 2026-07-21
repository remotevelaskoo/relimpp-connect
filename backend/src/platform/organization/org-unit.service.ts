import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateOrgUnitDto, UpdateOrgUnitDto } from './dto/org-unit.dto';

// Modelos Prisma que compartilham o mesmo formato de unidade organizacional.
export type OrgUnitModel =
  | 'branch'
  | 'department'
  | 'project'
  | 'costCenter';

// Serviço genérico reutilizado por filiais, departamentos, obras e centros de custo.
@Injectable()
export class OrgUnitService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(model: OrgUnitModel) {
    return (this.prisma as any)[model];
  }

  list(model: OrgUnitModel, companyId?: string) {
    return this.delegate(model).findMany({
      where: companyId ? { companyId } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(model: OrgUnitModel, id: string) {
    const item = await this.delegate(model).findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('Registro não encontrado.');
    }
    return item;
  }

  async create(model: OrgUnitModel, dto: CreateOrgUnitDto) {
    await this.ensureCompany(dto.companyId);
    return this.delegate(model).create({
      data: {
        companyId: dto.companyId,
        name: dto.name,
        code: dto.code ?? null,
        active: dto.active ?? true,
      },
    });
  }

  async update(model: OrgUnitModel, id: string, dto: UpdateOrgUnitDto) {
    await this.get(model, id);
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.code !== undefined) data.code = dto.code || null;
    if (dto.active !== undefined) data.active = dto.active;
    return this.delegate(model).update({ where: { id }, data });
  }

  private async ensureCompany(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException('Empresa informada não existe.');
    }
  }
}
