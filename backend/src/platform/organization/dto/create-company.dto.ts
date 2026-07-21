import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsCnpj } from '../../../core/validation/is-cnpj.validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Relimpp Indústria Ltda' })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name: string;

  @ApiPropertyOptional({ example: 'Relimpp' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  tradeName?: string;

  @ApiPropertyOptional({ example: '11.222.333/0001-81', description: 'CNPJ; será padronizado como xx.xxx.xxx/xxxx-xx.' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsCnpj()
  cnpj?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
