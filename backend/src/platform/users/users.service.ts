import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  AssignRoleDto,
  CreateUserDto,
  SetPasswordDto,
  UpdateUserDto,
} from './dto/user.dto';

const roleScopeInclude = {
  roleScopes: { include: { role: true, company: { select: { id: true, name: true } } } },
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { roleScopes: { include: { role: true } } },
    });
  }

  async findByIdSafe(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roleScopes: { include: { role: true } } },
    });
    if (!user) return null;
    const { passwordHash: _passwordHash, ...safe } = user;
    return {
      ...safe,
      roles: user.roleScopes.map((rs) => rs.role.key),
    };
  }

  async list(companyId?: string) {
    const users = await this.prisma.user.findMany({
      where: companyId ? { companyId } : {},
      orderBy: { name: 'asc' },
      include: roleScopeInclude,
    });
    return users.map(({ passwordHash: _passwordHash, ...safe }) => safe);
  }

  async get(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: roleScopeInclude,
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const created = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash,
          companyId: dto.companyId ?? null,
        },
      });
      return this.get(created.id);
    } catch (error) {
      throw this.mapKnownErrors(error);
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.get(id);
    const data: Prisma.UserUpdateInput = {
      version: { increment: 1 },
    };
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.active !== undefined) data.active = dto.active;
    if (dto.companyId !== undefined) {
      data.company = dto.companyId
        ? { connect: { id: dto.companyId } }
        : { disconnect: true };
    }

    try {
      await this.prisma.user.update({ where: { id }, data });
      return this.get(id);
    } catch (error) {
      throw this.mapKnownErrors(error);
    }
  }

  async setPassword(id: string, dto: SetPasswordDto) {
    await this.get(id);
    const passwordHash = await bcrypt.hash(dto.password, 10);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash, version: { increment: 1 } },
    });
    return { updated: true };
  }

  async assignRole(id: string, dto: AssignRoleDto) {
    await this.get(id);
    const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
    if (!role) {
      throw new NotFoundException('Papel não encontrado.');
    }
    if (dto.companyId) {
      const company = await this.prisma.company.findUnique({ where: { id: dto.companyId } });
      if (!company) {
        throw new NotFoundException('Empresa informada não existe.');
      }
    }
    await this.prisma.userRoleScope.create({
      data: { userId: id, roleId: dto.roleId, companyId: dto.companyId ?? null },
    });
    return this.get(id);
  }

  async removeRoleScope(id: string, roleScopeId: string) {
    const scope = await this.prisma.userRoleScope.findUnique({ where: { id: roleScopeId } });
    if (!scope || scope.userId !== id) {
      throw new NotFoundException('Vínculo de papel não encontrado para este usuário.');
    }
    await this.prisma.userRoleScope.delete({ where: { id: roleScopeId } });
    return this.get(id);
  }

  private mapKnownErrors(error: unknown): unknown {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return new ConflictException('Já existe um usuário com este e-mail.');
    }
    return error;
  }
}
