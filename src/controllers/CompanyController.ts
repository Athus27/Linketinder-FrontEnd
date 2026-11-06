import type { Company } from "../models/Company";
import { CompanyService } from "../services/CompanyService";

export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  async getEmpresas(): Promise<Company[]> {
    return this.companyService.getEmpresas();
  }
}
