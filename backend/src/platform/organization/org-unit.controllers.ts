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
import { OrgUnitModel, OrgUnitService } from './org-unit.service';
import { CreateOrgUnitDto, UpdateOrgUnitDto } from './dto/org-unit.dto';

// Controller base com as rotas comuns; as subclasses apenas definem o modelo e o path.
abstract class BaseOrgUnitController {
  protected abstract model: OrgUnitModel;

  constructor(protected readonly service: OrgUnitService) {}

  @Get()
  list(@Query('companyId') companyId?: string) {
    return this.service.list(this.model, companyId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(this.model, id);
  }

  @Post()
  create(@Body() dto: CreateOrgUnitDto) {
    return this.service.create(this.model, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrgUnitDto) {
    return this.service.update(this.model, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(this.model, id);
  }
}

@ApiTags('branches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchController extends BaseOrgUnitController {
  protected model: OrgUnitModel = 'branch';
  constructor(service: OrgUnitService) {
    super(service);
  }
}

@ApiTags('departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentController extends BaseOrgUnitController {
  protected model: OrgUnitModel = 'department';
  constructor(service: OrgUnitService) {
    super(service);
  }
}

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController extends BaseOrgUnitController {
  protected model: OrgUnitModel = 'project';
  constructor(service: OrgUnitService) {
    super(service);
  }
}

@ApiTags('cost-centers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cost-centers')
export class CostCenterController extends BaseOrgUnitController {
  protected model: OrgUnitModel = 'costCenter';
  constructor(service: OrgUnitService) {
    super(service);
  }
}
