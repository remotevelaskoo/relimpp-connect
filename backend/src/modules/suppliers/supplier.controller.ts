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
import { CurrentUser } from '../../core/auth/current-user.decorator';
import { SupplierService } from './supplier.service';
import {
  ApproveSupplierDto,
  CreateSupplierDto,
  SupplierReasonDto,
  UpdateSupplierDto,
} from './dto/supplier.dto';

@ApiTags('suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly service: SupplierService) {}

  @Get()
  list(@Query('companyId') companyId?: string) {
    return this.service.list(companyId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  create(
    @Body() dto: CreateSupplierDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.service.create(dto, user?.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.service.update(id, dto, user?.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/submit-for-review')
  submitForReview(
    @Param('id') id: string,
    @CurrentUser() user: { id?: string },
  ) {
    return this.service.submitForReview(id, user?.id);
  }

  @Post(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() dto: ApproveSupplierDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.service.approve(id, dto, user?.id);
  }

  @Post(':id/suspend')
  suspend(
    @Param('id') id: string,
    @Body() dto: SupplierReasonDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.service.suspend(id, dto, user?.id);
  }

  @Post(':id/block')
  block(
    @Param('id') id: string,
    @Body() dto: SupplierReasonDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.service.block(id, dto, user?.id);
  }

  @Post(':id/reactivate')
  reactivate(@Param('id') id: string, @CurrentUser() user: { id?: string }) {
    return this.service.reactivate(id, user?.id);
  }

  @Post(':id/inactivate')
  inactivate(
    @Param('id') id: string,
    @Body() dto: SupplierReasonDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.service.inactivate(id, dto, user?.id);
  }
}
