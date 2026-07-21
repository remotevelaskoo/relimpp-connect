import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { formatCnpj } from '../../core/validation/cnpj.util';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.company.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async get(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }
    return company;
  }

  async create(dto: CreateCompanyDto, actorId?: string) {
    try {
      return await this.prisma.company.create({
        data: {
          name: dto.name,
          tradeName: dto.tradeName ?? null,
          cnpj: dto.cnpj ? formatCnpj(dto.cnpj) : null,
          active: dto.active ?? true,
          createdBy: actorId ?? null,
          updatedBy: actorId ?? null,
        },
      });
    } catch (error) {
      throw this.mapKnownErrors(error);
    }
  }

  async update(id: string, dto: UpdateCompanyDto, actorId?: string) {
    await this.get(id);
    const data: Prisma.CompanyUpdateInput = {
      updatedBy: actorId ?? null,
      version: { increment: 1 },
    };
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.tradeName !== undefined) data.tradeName = dto.tradeName || null;
    if (dto.cnpj !== undefined) data.cnpj = dto.cnpj ? formatCnpj(dto.cnpj) : null;
    if (dto.active !== undefined) data.active = dto.active;

    try {
      return await this.prisma.company.update({ where: { id }, data });
    } catch (error) {
      throw this.mapKnownErrors(error);
    }
  }

  private mapKnownErrors(error: unknown): unknown {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return new ConflictException('Já existe uma empresa com este CNPJ.');
    }
    return error;
  }
}
