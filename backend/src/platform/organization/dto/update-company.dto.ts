import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';

// Todos os campos opcionais; reaproveita validações de CreateCompanyDto (inclui CNPJ).
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
