import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const CRITICALITIES = ['low', 'medium', 'high'];

export class PurchaseRequestItemDto {
  @ApiProperty({ example: 'Cimento CP-II 50kg' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  description: string;

  @ApiPropertyOptional({ example: 'Marca X, saco 50kg' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  specification?: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0.0001)
  quantity: number;

  @ApiProperty({ example: 'sc' })
  @IsString()
  @MaxLength(20)
  unit: string;

  @ApiPropertyOptional({ example: 32.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedPrice?: number;

  @ApiPropertyOptional({ example: '2026-08-15', description: 'Data em que o item é necessário.' })
  @IsOptional()
  @IsDateString()
  neededDate?: string;

  @ApiPropertyOptional({ example: 'Obra Centro - Almoxarifado' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  deliveryLocation?: string;
}

export class CreatePurchaseRequestDto {
  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'Reposição de materiais da obra Centro.' })
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  justification: string;

  @ApiPropertyOptional({ enum: PRIORITIES, example: 'medium' })
  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: string;

  // Vínculo organizacional (Especificação, seção 8.1). Todos opcionais; quando
  // informados, o service valida que pertencem à mesma companyId.
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  branchId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Obra.' })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  costCenterId?: string;

  @ApiPropertyOptional({ description: 'Categoria da Category com type="purchase".' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: CRITICALITIES })
  @IsOptional()
  @IsIn(CRITICALITIES)
  criticality?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  confidential?: boolean;

  @ApiProperty({ type: [PurchaseRequestItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseRequestItemDto)
  items: PurchaseRequestItemDto[];
}

export class UpdatePurchaseRequestDto extends PartialType(
  CreatePurchaseRequestDto,
) {
  @ApiPropertyOptional({ readOnly: true })
  @IsOptional()
  companyId?: string;
}

export class DecisionDto {
  @ApiProperty({ example: 'Justificativa obrigatória para rejeição/devolução.' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  justification: string;
}

export class CancelDto {
  @ApiProperty({ example: 'Motivo do cancelamento.' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  reason: string;
}
