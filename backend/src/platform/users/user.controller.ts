import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import {
  AssignRoleDto,
  CreateUserDto,
  SetPasswordDto,
  UpdateUserDto,
} from './dto/user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list(@Query('companyId') companyId?: string) {
    return this.users.list(companyId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.users.get(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Post(':id/set-password')
  setPassword(@Param('id') id: string, @Body() dto: SetPasswordDto) {
    return this.users.setPassword(id, dto);
  }

  @Post(':id/role-scopes')
  assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return this.users.assignRole(id, dto);
  }

  @Delete(':id/role-scopes/:roleScopeId')
  removeRoleScope(
    @Param('id') id: string,
    @Param('roleScopeId') roleScopeId: string,
  ) {
    return this.users.removeRoleScope(id, roleScopeId);
  }
}
