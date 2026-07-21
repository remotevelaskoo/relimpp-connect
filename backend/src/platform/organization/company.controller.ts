import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { CurrentUser } from '../../core/auth/current-user.decorator';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companies: CompanyService) {}

  @Get()
  list() {
    return this.companies.list();
  }

  @Post()
  create(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.companies.create(dto, user?.id);
  }
}
