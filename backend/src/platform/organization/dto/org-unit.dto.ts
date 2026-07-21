import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrgUnitDto {
  @ApiProperty({ description: 'Empresa (tenant) à qual a unidade pertence.' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'Filial São Paulo' })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name: string;

  @ApiPropertyOptional({ example: 'SP-01' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  code?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

// Não permite trocar a empresa da unidade após criada.
export class UpdateOrgUnitDto extends PartialType(CreateOrgUnitDto) {
  @ApiPropertyOptional({ readOnly: true })
  @IsOptional()
  companyId?: string;
}
