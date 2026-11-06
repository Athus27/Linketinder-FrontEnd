import {CreateCandidateInput} from "../types/EntityInputs";
import type { CandidateRequest } from "../types/CandidateRequest";
import { Candidate } from "../models/Candidate";
import type { CandidateResponse } from "../types/CandidateResponse";

export class CandidateService {
  url: string;

  constructor() {
    this.url = `${import.meta.env.VITE_API_URL}/api/candidatos`;
  }

  async cadastrarCandidato(candidato: CreateCandidateInput): Promise<boolean> {
    const [ano, mes, dia] = candidato.birthDate.split("-");
    const dados: CandidateRequest = {
      nome: candidato.name,
      sobrenome: candidato.surname,
      dataNascimento: `${dia}/${mes}/${ano}`,
      cpf: candidato.cpf,
      descricao: candidato.description,
      email: candidato.email,
      pais: candidato.country,
      cep: candidato.cepCode,
      senha: candidato.password,
      competencias: candidato.skills,
    };
    const response = fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const res = await response;
    return res.ok;
  }

  async getCandidatos(): Promise<Candidate[]> {
    const response = await fetch(this.url);

    if (!response.ok) {
      throw new Error(`Erro ao buscar candidatos: HTTP ${response.status}`);
    }

    const dados: CandidateResponse[] = await response.json();

    return dados.map((dado) => {
      const candidato = new Candidate(
        dado.nome,
        dado.cpf,
        dado.dataNascimento,
        dado.descricao,
        dado.email,
        "",
        dado.cep,
        dado.competencias
      );

      candidato.id = String(dado.id);
      return candidato;
    });
  }
}
