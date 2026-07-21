import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
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
