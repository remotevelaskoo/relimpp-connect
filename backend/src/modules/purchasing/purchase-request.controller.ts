import {
  Body,
  Controller,
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
import { PurchaseRequestService } from './purchase-request.service';
import {
  CancelDto,
  CreatePurchaseRequestDto,
  DecisionDto,
  UpdatePurchaseRequestDto,
} from './dto/purchase-request.dto';

@ApiTags('purchase-requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('purchase-requests')
export class PurchaseRequestController {
  constructor(private readonly service: PurchaseRequestService) {}

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
    @Body() dto: CreatePurchaseRequestDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseRequestDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.service.submit(id, user.id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.service.approve(id, user.id);
  }

  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() dto: DecisionDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.reject(id, dto, user.id);
  }

  @Post(':id/return')
  returnForAdjustment(
    @Param('id') id: string,
    @Body() dto: DecisionDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.returnForAdjustment(id, dto, user.id);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.cancel(id, dto, user.id);
  }
}
