import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsCnpj } from '../../../core/validation/is-cnpj.validator';

export class CreateSupplierDto {
  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'Fornecedor Exemplo Ltda' })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name: string;

  @ApiPropertyOptional({ example: 'Exemplo' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  tradeName?: string;

  @ApiPropertyOptional({ example: '11.222.333/0001-81' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsCnpj()
  cnpj?: string;

  @ApiPropertyOptional({ example: 'contato@fornecedor.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '(11) 4000-0000' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @ApiPropertyOptional({ readOnly: true })
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class ApproveSupplierDto {
  @ApiPropertyOptional({
    description: 'true = homologa com restrição em vez de homologação plena.',
  })
  @IsOptional()
  @IsBoolean()
  restricted?: boolean;
}

export class SupplierReasonDto {
  @ApiProperty({ example: 'Motivo obrigatório para esta ação.' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  reason: string;
}
