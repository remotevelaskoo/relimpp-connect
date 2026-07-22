import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  CreateRoleDto,
  SetRolePermissionsDto,
  UpdateRoleDto,
} from './dto/role.dto';

const permissionsInclude = {
  permissions: { include: { permission: true } },
};

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: permissionsInclude,
    });
  }

  async get(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: permissionsInclude,
    });
    if (!role) {
      throw new NotFoundException('Papel não encontrado.');
    }
    return role;
  }

  async create(dto: CreateRoleDto) {
    try {
      const created = await this.prisma.role.create({
        data: { key: dto.key, name: dto.name, description: dto.description ?? null },
      });
      return this.get(created.id);
    } catch (error) {
      throw this.mapKnownErrors(error);
    }
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.get(id);
    const data: Prisma.RoleUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description || null;
    await this.prisma.role.update({ where: { id }, data });
    return this.get(id);
  }

  async setPermissions(id: string, dto: SetRolePermissionsDto) {
    await this.get(id);
    if (dto.permissionIds.length > 0) {
      const count = await this.prisma.permission.count({
        where: { id: { in: dto.permissionIds } },
      });
      if (count !== dto.permissionIds.length) {
        throw new NotFoundException('Uma ou mais permissões informadas não existem.');
      }
    }
    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({ where: { roleId: id } }),
      this.prisma.rolePermission.createMany({
        data: dto.permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
      }),
    ]);
    return this.get(id);
  }

  listPermissions() {
    return this.prisma.permission.findMany({ orderBy: [{ resource: 'asc' }, { action: 'asc' }] });
  }

  private mapKnownErrors(error: unknown): unknown {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return new ConflictException('Já existe um papel com esta key.');
    }
    return error;
  }
}
