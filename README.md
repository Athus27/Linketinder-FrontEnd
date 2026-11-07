# Linketinder Front-End

Aplicação front-end em TypeScript, sem framework de interface. Candidatos,
empresas, recrutadores, vagas, curtidas e matches usam a API Groovy. A demo
legada com `localStorage` fica isolada e não inicia no fluxo real.

## Integração com a API

O [backend Groovy/PostgreSQL](https://github.com/Athus27/Linketinder-Project) permanece em um repositório separado. O frontend usa `fetch` para comunicar por HTTP; não acessa diretamente o banco.

Veja o [documento da integração entre frontend e backend](https://github.com/Athus27/Linketinder-Project/blob/main/docs/integracao-frontend-backend.md) para os fluxos de cadastro/login, exemplos JSON e limitações atuais.

| Recurso | Fonte dos dados atual |
|---|---|
| Visualizar candidatos | GET `/api/candidatos` pela API |
| Meu perfil de candidato | Consulta pela API e DELETE `/api/candidatos/{id}` do próprio titular; edição ainda não integrada |
| Visualizar empresas | GET `/api/empresas` pela API |
| Visualizar vagas | GET `/api/vagas` pela API |
| Cadastro de candidato | POST `/api/candidatos` |
| Cadastro de empresa | POST `/api/empresas` |
| Cadastro de vaga | POST `/api/vagas`, somente empresa autenticada |
| Contadores e gráfico de competências por vaga | Consultas à API |
| Curtidas e matches | POST `/api/curtidas` e GET `/api/matches` |
| Recrutadores | GET/POST `/api/recrutadores` e DELETE por ID; gestão pela empresa |
| Login | POST `/api/auth/login`; perfil e token Bearer somente em memória |

Os formulários convertem os campos para o contrato da API. Senhas não ficam
no modelo ou `localStorage`. O login mostra nome/papel no cabeçalho; o token é
enviado como Bearer e o backend valida cada operação. Sair revoga a sessão e
limpa a interface; atualizar a página perde o estado local. Editar candidatos
e editar/excluir vagas ainda não estão integrados.

A empresa gerencia seus recrutadores; eles analisam vagas próprias e
candidatos e representam a empresa nas curtidas. Antes do match, os cards são
anônimos; o contato só aparece quando autorizado pela API. CPF, CNPJ,
nascimento e senha nunca são exibidos nas listagens. Contadores e gráfico de
competências consultam a API; o gráfico também fica disponível ao visitante.

## Como executar

É necessário ter Node.js e npm instalados. Na raiz deste repositório, crie `.env`, ao lado de `package.json`:

```dotenv
# .env — endereço do backend local
VITE_API_URL=http://localhost:8080
```

Os services leem `import.meta.env.VITE_API_URL` e acrescentam o endpoint correspondente, como `/api/candidatos` ou `/api/recrutadores`. Reinicie o Vite após alterar a configuração. O `.env` é ignorado pelo Git; variáveis com prefixo `VITE_` são expostas ao frontend e não devem conter senhas.

Inicie o PostgreSQL e o backend conforme seu README. Em outro terminal, na raiz do frontend:

```bash
npm install
# Instala as dependências do frontend.
npm run dev
# Inicia o servidor de desenvolvimento do Vite.
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.

**CORS:** o backend autoriza por padrão `http://localhost:5173` e trata o preflight `OPTIONS`, incluindo `Authorization`. Se o Vite usar outra origem, configure `FRONTEND_ORIGIN` no backend e reinicie a API. `VITE_API_URL` define o destino da consulta; CORS não substitui autenticação. Aplique a migração V2 conforme o README do backend antes de usar o login desta versão.

As páginas remotas mostram carregamento, lista vazia e erro de consulta. Os testes no Node não substituem a verificação do fluxo no navegador.

```bash
npm run build
# Verifica os tipos e gera a versão de produção em dist.
npm run preview
# Disponibiliza localmente a versão gerada para inspeção.
```

## Testes

```bash
npm run test:run
# Executa a suíte de services, controllers e telas; a integração externa fica ignorada por padrão.

npm test
# Executa os testes em modo de observação.
```

```bash
VITE_RUN_API_INTEGRATION=true npx vitest run tests/services/CandidateService.integration.test.ts
# Habilita a consulta à API configurada e verifica a projeção anônima; exige backend e banco disponíveis.
```

O teste de integração possui asserções para verificar aliases e ausência de CPF,
nascimento, CEP e e-mail na consulta anônima; não imprime os dados recebidos.
Os testes de tela usam `happy-dom`, com respostas HTTP simuladas, e incluem
menus por perfil, gestão de recrutadores, curtidas e estados de erro.
Esses testes não substituem a validação no navegador com a API real.

## Arquitetura

A organização separa páginas, componentes, controllers, services e modelos,
mantendo a comunicação HTTP nos services e as regras de autorização no backend.

### Responsabilidades

`main.ts` chama somente `renderAll()`. Essa função monta a aplicação, coordena
a navegação e recria o cabeçalho após login/logout. O `Header` recebe o perfil
autenticado e mostra apenas o menu correspondente; páginas e componentes
montam a interface diretamente com a API do DOM.

`SessionService` mantém usuário e token em memória, adiciona Bearer às chamadas
protegidas e trata a invalidação da sessão. Controllers coordenam chamadas
onde utilizados; as listagens em `renderAll` recebem funções que chamam os
services diretamente. A autorização efetiva e as regras de match ficam no
backend, não nos menus.

### estilização
Como o módulo desse curso de TS e o contexto do desafio era focar no front-end, utilizei minha experiencia prévia de designer gráfico (confira aqui >> https://www.behance.net/athussilvasouza) pra tentar desenvolver um design limpo e agradável, utilizei regras de contraste para escolher as cores, mas me baseei na imagem do desafio (gosto muito de tons de azul). Usei essas regras e somado com o que aprendi no curso de html + css padronizei as cores e defini regras globais em `styles/global.css` e deixei as específicas no mesmo nível do componente/página. **Deixo claro que não utilizei react**. A imagem que me baseei para criar a paleta de cores:
![alt text](public/docs/image.png)

#### Grafico de Skills
> utiliza biblioteca `chart.js` para criar um gráfico a partir de uma `Job`, e retorna um grafico de contagem de frequencia das competencias para aquela vaga

#### estrutura de pastas

```text
src/
├── app/                  # Demo legada isolada; não inicia no fluxo real
├── controllers/          # Coordenação das chamadas aos services
├── services/             # Comunicação HTTP, sessão em memória e conversão da resposta
├── models/               # Candidate, Company, Job, Like e User
├── types/                # Contratos de perfis, sessão, vagas, recrutadores, curtidas e matches
├── view/
│   ├── components/       # Formulários, cartões, layout e gráficos
│   └── pages/            # Composição das páginas
├── styles/
├── main.ts
└── renderAll.ts
tests/
├── controllers/
├── services/
└── view/
```

Na consulta remota, a página aguarda a função de busca fornecida por
`renderAll`. O `CandidateService` executa GET e converte a resposta em
`Candidate`, preservando o ID do banco como string. Antes do match, o nome é
`Candidato #ID`, com competências e formação; os campos privados ficam vazios.
Nome, e-mail e descrição profissional só são usados quando liberados pela API.

A demo `LinketinderApp` permanece separada, com regras e persistência locais.
O fluxo integrado não a instancia nem gera IDs de vagas no navegador: os IDs
vêm do banco após o cadastro pela API.

## Listagem remota de empresas e vagas

`renderAll` fornece às páginas funções de busca com `CompanyService` e
`JobService`. `CompanyFeedPage` e `JobFeedPage` aguardam os dados e mostram
carregamento, lista vazia ou erro de consulta.

O `CompanyService` monta a listagem com aliases `Empresa #ID` e campos privados
vazios. O contato pós-match é mostrado na página de matches, por meio do
`MatchService`. O `JobService` converte `titulo`, `descricao`, `idEmpresa` e
`competencias` em `title`, `description`, `companyId` e `skills`, preservando
os IDs como strings. Empresa e recrutador consultam vagas próprias com
`?minhas=true`; o candidato consulta as oportunidades disponíveis. O formulário
envia `localVaga` no cadastro, mas esse campo não é exibido no card de vaga.

Os testes unitários dos services verificam conversão, preservação dos IDs, lista vazia, falha HTTP e falha de conexão. Os testes dos controllers verificam retorno da lista e propagação de erros. A InfoSection consulta empresas, candidatos e vagas da API; falhas aparecem como indisponibilidade, não como zero. O gráfico carrega vagas e candidatos do backend e conta quantos candidatos possuem cada competência exigida pela vaga selecionada.
