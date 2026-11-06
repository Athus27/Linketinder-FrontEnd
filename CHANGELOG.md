# Changelog

## [Não lançado]

### Adicionado

- Contexto local do frontend em `AGENTS.md`, com stack, comandos, domínio e
  restrições de anonimato e segredos.
- Contratos de sessão em memória, recrutador, curtida, match e criação de vaga,
  com services HTTP autenticados e DTOs allowlistados.
- Testes Vitest para Bearer por requisição, logout/401, papéis, payloads e
  projeções anônimas.
- T5: telas reais sem inicializar `LinketinderApp`, navegação por papel,
  gestão de recrutadores, vagas/curtidas/matches via API e cards anônimos.
- Revisão T5: alvo de curtida por card, pseudônimos técnicos, formação e
  contato pós-match, estados completos de gestão, corrida de 401, logout,
  contadores e guards de papel foram cobertos por testes DOM.
- Ambiente `happy-dom` como devDependency para testes DOM sintéticos, sem
  transformar esses testes em E2E de navegador.

### Modificado

- A integração da API permanece isolada dos demos e da inicialização legada:
  `LinketinderApp` permanece somente como demo isolada; `main.ts` renderiza o
  fluxo real sem semear ou consultar `localStorage`.
- T4 foi confirmada no histórico pelo commit frontend `36759bb`.

### Corrigido

- A integração de candidatos foi tornada opt-in (`VITE_RUN_API_INTEGRATION=true`)
  e deixou de imprimir dados retornados.
- Revisão T4 endureceu contratos de login, curtida, recrutador e match:
  payloads inválidos são rejeitados, PII extra é removida e `dataMatch: null`
  não é convertido em uma data inventada.

### Removido

- Nada removido.
