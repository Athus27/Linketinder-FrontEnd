import { Company } from "../models/Company";
import type { CompanyResponse } from "../types/CompanyResponse";
import type { CreateCompanyInput } from "../types/EntityInputs";

export class CompanyService {
  private readonly url = `${import.meta.env.VITE_API_URL}/api/empresas`;

  async cadastrarEmpresa(empresa: CreateCompanyInput): Promise<boolean> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: empresa.name,
        cnpj: empresa.cnpj,
        descricao: empresa.description,
        email: empresa.email,
        senha: empresa.password,
        pais: empresa.country,
        cep: empresa.cepCode,
      }),
    });

    return response.status === 201;
  }

  async getEmpresas(): Promise<Company[]> {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar empresas: HTTP ${response.status}`);
    }
    const dados: CompanyResponse[] = await response.json();
    return dados.map((dado) => {
      const company = new Company(
        dado.nome, dado.cnpj, dado.descricao, dado.email, "", dado.cep, dado.pais
      );
      company.id = String(dado.id);
      return company;
    });
  }
}
