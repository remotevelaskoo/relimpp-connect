import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { RoleService } from './role.service';
import { RoleController, PermissionController } from './role.controller';

@Module({
  controllers: [UserController, RoleController, PermissionController],
  providers: [UsersService, RoleService],
  exports: [UsersService],
})
export class UsersModule {}
