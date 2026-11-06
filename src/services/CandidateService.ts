import {CreateCandidateInput} from "../types/EntityInputs";

export class CandidateService {
  url: string;

  constructor() {
    this.url = `${import.meta.env.VITE_API_URL}/api/candidatos`;
  }

  async cadastrarCandidato(candidato: CreateCandidateInput): Promise<boolean> {
    const response = fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidato),
    });

    const res = await response;
    return res.ok;
  }

  async getCandidatos(): Promise<JSON> {
    const response = await fetch(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    return res;
  }
}