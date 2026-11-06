import { CreateCandidateInput } from "../types/EntityInputs";
import type { CandidateRequest } from "../types/CandidateRequest";
import { Candidate } from "../models/Candidate";
import type { CandidateResponse } from "../types/CandidateResponse";
import { sharedSessionService, SessionService } from "./SessionService";

export class CandidateService {
  readonly url: string;

  constructor(private readonly session: SessionService = sharedSessionService) {
    this.url = `${import.meta.env.VITE_API_URL}/api/candidatos`;
  }

  async cadastrarCandidato(candidato: CreateCandidateInput): Promise<boolean> {
    const [ano, mes, dia] = candidato.birthDate.split("-");
    const dados: CandidateRequest = {
      nome: candidato.name, sobrenome: candidato.surname,
      dataNascimento: `${dia}/${mes}/${ano}`, cpf: candidato.cpf,
      descricao: candidato.description, email: candidato.email,
      pais: candidato.country, cep: candidato.cepCode, senha: candidato.password,
      competencias: candidato.skills,
    };
    const response = await this.session.requestResponse(this.url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    return response.status === 201;
  }

  async getCandidatos(): Promise<Candidate[]> {
    const dados = await this.session.request<CandidateResponse[]>(this.url);
    return dados.map((dado) => {
      const contactAllowed = Boolean(dado.nome && dado.email);
      const candidato = new Candidate(
        contactAllowed ? dado.nome! : `Candidato #${dado.id}`, "",
        "", contactAllowed ? dado.descricao || "" : "", contactAllowed ? dado.email! : "", "", "", dado.competencias,
        dado.formacao || "",
      );
      candidato.id = String(dado.id);
      return candidato;
    });
  }

  async excluirCandidato(id: string): Promise<boolean> {
    const response = await this.session.requestResponse(`${this.url}/${id}`, { method: "DELETE" });
    return response.status === 204;
  }
}
