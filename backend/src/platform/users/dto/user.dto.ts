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

export class CreateUserDto {
  @ApiProperty({ example: 'Maria Souza' })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name: string;

  @ApiProperty({ example: 'maria@relimpp.local' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Senha@123', description: 'Mínimo 8 caracteres.' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  companyId?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ readOnly: true, description: 'Troca de senha via /users/:id/set-password.' })
  @IsOptional()
  password?: never;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class SetPasswordDto {
  @ApiProperty({ example: 'NovaSenha@123' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}

export class AssignRoleDto {
  @ApiProperty()
  @IsUUID()
  roleId: string;

  @ApiPropertyOptional({
    description: 'Escopo de empresa deste papel. Vazio = papel global (todas as empresas).',
  })
  @IsOptional()
  @IsUUID()
  companyId?: string;
}
