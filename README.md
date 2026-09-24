# Linketinder Front-End

Aplicação front-end em TypeScript para cadastrar candidatos, empresas e vagas. Os dados e as curtidas são armazenados no `localStorage`; quando candidato e empresa curtem a mesma relação candidato–vaga, ocorre um match.

## Como executar

É necessário ter Node.js e npm instalados.

```bash
npm install
npm run dev
```

Abra no navegador o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

Para verificar e gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Arquitetura

```text
Linketinder-FrontEnd/
├── public/assets/icons/  # Ícones utilizados pela interface
├── src/
│   ├── app/             # Orquestrador e persistência no localStorage
│   ├── components/      # Formulários, cards, cabeçalho e elementos reutilizáveis
│   ├── models/          # Entidades: candidato, empresa, vaga e curtida
│   ├── pages/           # Páginas e fluxos exibidos na aplicação
│   ├── styles/          # Estilos globais
│   ├── types/           # Tipos auxiliares e dados de entrada
│   ├── main.ts          # Inicialização da aplicação
│   └── renderAll.ts     # Navegação e renderização das páginas
├── index.html
└── package.json
```

A interface é construída diretamente com a API do DOM. O `LinketinderApp` concentra as regras de negócio e o acesso ao `localStorage`, enquanto as páginas coordenam os componentes exibidos.
