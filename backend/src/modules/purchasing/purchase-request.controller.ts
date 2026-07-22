import * as fs from 'fs';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../core/auth/permissions.guard';
import { RequirePermission } from '../../core/auth/permission.decorator';
import { CurrentUser } from '../../core/auth/current-user.decorator';
import { PurchaseRequestService } from './purchase-request.service';
import {
  attachmentAbsolutePath,
  purchaseRequestAttachmentStorage,
} from './attachment-storage.util';
import {
  CancelDto,
  CreatePurchaseRequestDto,
  DecisionDto,
  UpdatePurchaseRequestDto,
} from './dto/purchase-request.dto';

const MAX_ATTACHMENT_SIZE = 15 * 1024 * 1024; // 15MB

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
  @UseGuards(PermissionsGuard)
  @RequirePermission('purchase_request:submit')
  submit(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.service.submit(id, user.id);
  }

  @Post(':id/approve')
  @UseGuards(PermissionsGuard)
  @RequirePermission('purchase_request:approve')
  approve(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.service.approve(id, user.id);
  }

  @Post(':id/reject')
  @UseGuards(PermissionsGuard)
  @RequirePermission('purchase_request:reject')
  reject(
    @Param('id') id: string,
    @Body() dto: DecisionDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.reject(id, dto, user.id);
  }

  @Post(':id/return')
  @UseGuards(PermissionsGuard)
  @RequirePermission('purchase_request:return')
  returnForAdjustment(
    @Param('id') id: string,
    @Body() dto: DecisionDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.returnForAdjustment(id, dto, user.id);
  }

  @Post(':id/cancel')
  @UseGuards(PermissionsGuard)
  @RequirePermission('purchase_request:cancel')
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.cancel(id, dto, user.id);
  }

  @Post(':id/attachments')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: purchaseRequestAttachmentStorage(),
      limits: { fileSize: MAX_ATTACHMENT_SIZE },
    }),
  )
  uploadAttachment(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id?: string },
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado (campo "file").');
    }
    const storagePath = `${id}/${file.filename}`;
    return this.service.addAttachment(id, file, storagePath, user?.id);
  }

  @Get(':id/attachments/:attachmentId/download')
  async downloadAttachment(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @Res() res: Response,
  ) {
    const attachment = await this.service.getAttachment(id, attachmentId);
    res.download(attachmentAbsolutePath(attachment.storagePath), attachment.fileName);
  }

  @Delete(':id/attachments/:attachmentId')
  async removeAttachment(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: { id?: string },
  ) {
    const result = await this.service.removeAttachment(id, attachmentId, user?.id);
    fs.unlink(attachmentAbsolutePath(result.storagePath), () => {
      // best-effort: se o arquivo já não existir, ignora.
    });
    return { deleted: true };
  }
}
