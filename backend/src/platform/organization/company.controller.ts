import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
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

  @Get(':id')
  get(@Param('id') id: string) {
    return this.companies.get(id);
  }

  @Post()
  create(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.companies.create(dto, user?.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: { id?: string },
  ) {
    return this.companies.update(id, dto, user?.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companies.remove(id);
  }
}
