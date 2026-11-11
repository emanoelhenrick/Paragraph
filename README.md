# Paragraph

> Um espaço de escrita para transformar ideias em histórias.

Paragraph é um editor desktop para criação de histórias, construído com React, Electron e Tiptap. A aplicação organiza projetos e capítulos em uma interface de escrita focada, com ferramentas para editar, estruturar e acompanhar o desenvolvimento do texto.

## Visão geral

- Crie e abra projetos de escrita.
- Organize a história em capítulos.
- Edite o conteúdo com formatação rica, títulos, alinhamento, links, imagens e blocos de código.
- Acompanhe a contagem de palavras durante a escrita.
- Use tags para classificar capítulos.
- Encontre capítulos com busca fuzzy.
- Escolha entre os temas claro, escuro e do sistema.
- Salve os dados localmente por meio do processo principal do Electron.

## Stack

| Camada | Tecnologias |
| --- | --- |
| Interface | React, TypeScript, React Router |
| Editor | Tiptap, ProseMirror e extensões de formatação |
| Desktop | Electron e Electron Forge |
| Estilos | Tailwind CSS, Radix UI e componentes próprios |
| Estado e dados | Zustand, JSON local e IPC do Electron |
| Build | Vite, PostCSS e TypeScript |

## Requisitos

- Node.js 18 ou superior
- npm
- Linux, macOS ou Windows para desenvolvimento desktop

## Começando

Instale as dependências:

```bash
npm install
```

Para iniciar a aplicação Electron em desenvolvimento:

```bash
npm start
```

Para executar apenas o servidor de desenvolvimento do frontend:

```bash
npm run dev
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite. |
| `npm start` | Inicia o Electron Forge em modo de desenvolvimento. |
| `npm run preview` | Serve localmente o build do Vite. |
| `npm run package` | Empacota a aplicação Electron. |
| `npm run make` | Gera os instaladores configurados para a plataforma. |
| `npm run build` | Executa o build do frontend, empacota e gera os instaladores. |
| `npx tsc --noEmit` | Verifica os tipos sem gerar arquivos. |

## Persistência local

Os dados são mantidos pelo processo principal do Electron em JSON, dentro de uma pasta `projects` associada ao diretório de dados da aplicação:

```text
projects/
├── meta.json
└── <projeto>/
	├── info.json
	└── chapters/
		└── <capitulo>.json
```

O renderer conversa com o processo principal usando IPC exposto pelo `preload`, mantendo o acesso ao sistema de arquivos fora da interface web.

## Estrutura principal

```text
electron/
├── core/                 # Modelos, controladores e serviços de persistência
├── main.ts               # Processo principal do Electron
└── preload.ts            # API segura entre Electron e renderer

src/
├── components/           # Componentes de interface e editor
├── pages/                # Telas inicial e de projeto
├── states/               # Estado compartilhado
├── electron/             # Tipos e acesso à API do Electron
└── router.tsx            # Rotas da aplicação
```

## Estado atual

O projeto está em desenvolvimento ativo. A criação e edição de projetos e capítulos estão implementadas, enquanto as áreas de notas, cenas e estatísticas ainda funcionam como partes da experiência visual e não possuem o mesmo nível de persistência.

Ainda não há uma suíte de testes automatizados, lint configurado ou script dedicado de typecheck. A verificação manual recomendada é:

```bash
npx tsc --noEmit
npm run build
```

## Licença

Este projeto está marcado como `UNLICENSED` no `package.json`.