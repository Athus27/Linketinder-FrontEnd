# Orientações do frontend Linketinder

## Stack e comandos

TypeScript com Vite, DOM nativo, Chart.js e Vitest. A aplicação está em
`src/`, organizada em `app`, `controllers`, `models`, `services`, `types` e
`view`; testes ficam em `tests/`. Use `npm run dev`, `npm run build`,
`npm run test:run` (ou `npm test` em modo Vitest). O frontend usa `fetch` para
o backend e não acessa PostgreSQL diretamente.

## Domínio atual

Candidatos, empresas e vagas são modelos distintos. O backend fornece login,
cadastros e algumas listagens; vagas, curtidas e matches ainda têm caminhos em
`LinketinderApp` com persistência em `localStorage`. O match local ocorre
quando a curtida do candidato e a da empresa ficam verdadeiras no mesmo par
candidato-vaga. As telas de curtida usam seleções de nomes e a integração HTTP
de curtidas ainda não está concluída.

## Anonimato, autorização e segredos

Antes do match, cards, formulários e respostas HTTP só podem expor competências,
formação e experiência permitidas, sem identidade de candidato, empresa ou
recrutador. Depois do match pode liberar contato apropriado, mas nunca CPF,
CNPJ, data de nascimento, senha ou hash. O código atual ainda recebe/renderiza
dados identificáveis em feeds e serviços e o login fica apenas em memória, sem
sessão/token; não presumir garantias existentes. Essas lacunas devem ser
resolvidas na spec, no backend e no frontend.

Não confie em menus, IDs, `localStorage` ou validações de tela para autorização.
Use dados fictícios em testes e exemplos. Nunca leia, exiba ou versione `.env`,
senhas, tokens ou credenciais; `.env.example`, se criado, deve conter apenas
placeholders. Preserve a branch de integração e não remova trabalho existente.
Não faça PR, merge ou entrega pelo agente.
