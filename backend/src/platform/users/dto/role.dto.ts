import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'auditor_fiscal', description: 'Identificador único, snake_case.' })
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  @Matches(/^[a-z][a-z0-9_]*$/, {
    message: 'key deve ser snake_case (letras minúsculas, números e _).',
  })
  key: string;

  @ApiProperty({ example: 'Auditor Fiscal' })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name: string;

  @ApiPropertyOptional({ example: 'Acesso de leitura aos documentos fiscais.' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiPropertyOptional({ readOnly: true })
  @IsOptional()
  key?: string;
}

export class SetRolePermissionsDto {
  @ApiProperty({ type: [String], description: 'Substitui o conjunto completo de permissões do papel.' })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
