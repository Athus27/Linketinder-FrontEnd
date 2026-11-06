# Changelog

## [Não lançado]

### Adicionado

- Contexto local do frontend em `AGENTS.md`, com stack, comandos, domínio e
  restrições de anonimato e segredos.
- Contratos de sessão em memória, recrutador, curtida, match e criação de vaga,
  com services HTTP autenticados e DTOs allowlistados.
- Testes Vitest para Bearer por requisição, logout/401, papéis, payloads e
  projeções anônimas.

### Modificado

- A integração da API permanece isolada dos demos e da inicialização legada:
  telas reais e `main.ts` ficam para a T5.

### Corrigido

- A integração de candidatos foi tornada opt-in (`VITE_RUN_API_INTEGRATION=true`)
  e deixou de imprimir dados retornados.
- Revisão T4 endureceu contratos de login, curtida, recrutador e match:
  payloads inválidos são rejeitados, PII extra é removida e `dataMatch: null`
  não é convertido em uma data inventada.

### Removido

- Nada removido.
