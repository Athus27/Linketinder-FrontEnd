import type { Company } from "../models/Company";
import { CompanyService } from "../services/CompanyService";
import type { CreateCompanyInput } from "../types/EntityInputs";

export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  async getEmpresas(): Promise<Company[]> {
    return this.companyService.getEmpresas();
  }

  async cadastrarEmpresa(empresa: CreateCompanyInput): Promise<boolean> {
    return this.companyService.cadastrarEmpresa(empresa);
  }
}
