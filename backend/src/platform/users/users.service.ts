import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roleScopes: { include: { role: true } },
      },
    });
  }

  async findByIdSafe(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roleScopes: { include: { role: true } },
      },
    });
    if (!user) return null;
    const { passwordHash: _passwordHash, ...safe } = user;
    return {
      ...safe,
      roles: user.roleScopes.map((rs) => rs.role.key),
    };
  }
}
