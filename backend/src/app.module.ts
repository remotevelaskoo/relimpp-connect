import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './core/prisma/prisma.module';
import { HealthModule } from './core/health/health.module';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './platform/users/users.module';
import { OrganizationModule } from './platform/organization/organization.module';
import { PurchasingModule } from './modules/purchasing/purchasing.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    OrganizationModule,
    PurchasingModule,
    SuppliersModule,
  ],
})
export class AppModule {}
