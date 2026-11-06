import { Company } from "../models/Company";
import type { CompanyResponse } from "../types/CompanyResponse";
import type { CreateCompanyInput } from "../types/EntityInputs";
import { sharedSessionService, SessionService } from "./SessionService";

export class CompanyService {
  private readonly url = `${import.meta.env.VITE_API_URL}/api/empresas`;

  constructor(private readonly session: SessionService = sharedSessionService) {}

  async cadastrarEmpresa(empresa: CreateCompanyInput): Promise<boolean> {
    const response = await this.session.requestResponse(this.url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: empresa.name, cnpj: empresa.cnpj, descricao: empresa.description,
        email: empresa.email, senha: empresa.password, pais: empresa.country, cep: empresa.cepCode,
      }),
    });
    return response.status === 201;
  }

  async getEmpresas(): Promise<Company[]> {
    const dados = await this.session.request<CompanyResponse[]>(this.url);
    return dados.map((dado) => {
      const company = new Company(
        `Empresa #${dado.id}`, "", "", "", "", "", "",
      );
      company.id = String(dado.id);
      return company;
    });
  }
}
