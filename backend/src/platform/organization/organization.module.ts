import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { OrgUnitService } from './org-unit.service';
import {
  BranchController,
  CostCenterController,
  DepartmentController,
  ProjectController,
} from './org-unit.controllers';

@Module({
  controllers: [
    CompanyController,
    BranchController,
    DepartmentController,
    ProjectController,
    CostCenterController,
  ],
  providers: [CompanyService, OrgUnitService],
})
export class OrganizationModule {}
