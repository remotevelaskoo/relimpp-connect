import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  list(type?: string) {
    return this.prisma.category.findMany({
      where: { active: true, ...(type ? { type } : {}) },
      orderBy: { name: 'asc' },
    });
  }
}
