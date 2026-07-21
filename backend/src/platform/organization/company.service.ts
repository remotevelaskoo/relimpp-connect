import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.company.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateCompanyDto, actorId?: string) {
    try {
      return await this.prisma.company.create({
        data: {
          name: dto.name,
          tradeName: dto.tradeName ?? null,
          cnpj: dto.cnpj ?? null,
          active: dto.active ?? true,
          createdBy: actorId ?? null,
          updatedBy: actorId ?? null,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Já existe uma empresa com este CNPJ.');
      }
      throw error;
    }
  }
}
