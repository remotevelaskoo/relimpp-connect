import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { RoleService } from './role.service';
import {
  CreateRoleDto,
  SetRolePermissionsDto,
  UpdateRoleDto,
} from './dto/role.dto';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roles: RoleService) {}

  @Get()
  list() {
    return this.roles.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.roles.get(id);
  }

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roles.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roles.update(id, dto);
  }

  @Patch(':id/permissions')
  setPermissions(@Param('id') id: string, @Body() dto: SetRolePermissionsDto) {
    return this.roles.setPermissions(id, dto);
  }
}

@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly roles: RoleService) {}

  @Get()
  list() {
    return this.roles.listPermissions();
  }
}
