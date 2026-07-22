import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { PERMISSION_KEY } from './permission.decorator';

// Checa se o usuário autenticado tem, em pelo menos um dos papéis atribuídos a ele
// (em qualquer escopo de empresa — a granularidade por filial/obra/CC ainda não existe,
// ver Database Book), a permissão exigida pelo decorator @RequirePermission da rota.
// platform_admin tem bypass total (é o "superusuário" da plataforma).
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string | undefined>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required) return true;

    const request = context.switchToHttp().getRequest();
    const userId: string | undefined = request.user?.id;
    if (!userId) return false;

    const roleScopes = await this.prisma.userRoleScope.findMany({
      where: { userId },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });

    const hasPermission = roleScopes.some(
      (rs) =>
        rs.role.key === 'platform_admin' ||
        rs.role.permissions.some((rp) => rp.permission.key === required),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Ação exige a permissão "${required}", que nenhum dos seus papéis concede.`,
      );
    }
    return true;
  }
}
