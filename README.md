# Job Hunter

API para apoiar a organização da busca por vagas. O projeto usa NestJS, TypeORM e PostgreSQL e está estruturado em módulos de perfis, vagas, candidaturas e integração com um provedor de IA compatível com a API da OpenAI.

## Status do MVP

O backend contém endpoints para gerenciar perfis, vagas e candidaturas, além de um endpoint de geração de texto com IA.

A análise de aderência entre currículo e vaga, a geração de currículos otimizados para ATS e a candidatura automática são objetivos do produto, mas não devem ser considerados implementados apenas com a infraestrutura atual.

## Tecnologias

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Docker e Docker Compose
- Joi para validação de configuração
- API de IA compatível com o formato OpenAI

## Requisitos

- Node.js 22 ou superior
- npm
- Docker e Docker Compose, para executar a API e o banco em containers

## Configuração

Configure as variáveis de ambiente antes de iniciar a aplicação. Os nomes abaixo refletem as configurações usadas pelo projeto:

| Variável | Finalidade |
|---|---|
| `NODE_ENV` | Ambiente de execução |
| `PORT` | Porta da API |
| `API_PREFIX` | Prefixo global da API |
| `CORS_ORIGIN` | Origem permitida para requisições CORS |
| `DATABASE_URL` | String de conexão com PostgreSQL |
| `AI_API_KEY` | Chave de acesso ao provedor de IA |
| `AI_BASE_URL` | URL base do provedor; opcional para provedores compatíveis |
| `AI_MODEL` | Modelo usado na geração de texto |

Não versione chaves ou credenciais reais. Use valores exclusivos para desenvolvimento e produção.

## Executar com Docker Compose

Na raiz do projeto, inicie os serviços com:

- `docker compose up --build -d`

Para acompanhar os logs da API:

- `docker compose logs -f app`

Para parar os serviços:

- `docker compose down`

O Compose disponibiliza a API na porta `3000` e o PostgreSQL na porta `5432`. A configuração existente usa credenciais de desenvolvimento; substitua-as antes de qualquer uso fora do ambiente local.

## Executar localmente

1. Instale as dependências com `npm install`.
2. Configure as variáveis de ambiente necessárias.
3. Garanta que o PostgreSQL esteja em execução e acessível pela `DATABASE_URL`.
4. Inicie a aplicação em modo de desenvolvimento com `npm run start:dev`.

## Endpoints disponíveis

Considerando o prefixo `api/v1` configurado para a API:

### Perfis

- `POST /api/v1/profiles` — criar perfil
- `GET /api/v1/profiles/:id` — consultar perfil
- `PATCH /api/v1/profiles/:id` — atualizar perfil

### Vagas

- `POST /api/v1/jobs` — criar vaga
- `GET /api/v1/jobs` — listar vagas
- `GET /api/v1/jobs/:id` — consultar vaga
- `PATCH /api/v1/jobs/:id` — atualizar vaga
- `DELETE /api/v1/jobs/:id` — remover vaga

### Candidaturas

- `POST /api/v1/applications` — registrar candidatura
- `GET /api/v1/applications` — listar candidaturas
- `GET /api/v1/applications/:id` — consultar candidatura
- `PATCH /api/v1/applications/:id` — atualizar candidatura
- `DELETE /api/v1/applications/:id` — remover candidatura

### IA

- `POST /api/v1/ai/generate` — gerar texto usando o provedor configurado

O endpoint de IA exige uma chave válida em `AI_API_KEY`. O corpo e os campos aceitos por cada endpoint devem ser consultados nos DTOs correspondentes do projeto.

## Organização dos módulos

O projeto separa responsabilidades em camadas:

- `application` — serviços, tipos e portas de acesso a dependências.
- `infra` — controllers, DTOs, entidades TypeORM, repositórios e módulos NestJS.

Os módulos principais são `profile`, `jobs`, `applications` e `ai`.

## Próximos passos do produto

Para evoluir a API em direção ao agente de busca de emprego, o MVP poderá incluir:

1. Cadastro do currículo master do usuário, incluindo uma referência a um arquivo armazenado externamente, caso esse fluxo seja implementado.
2. Extração e normalização das experiências, competências e formação do currículo.
3. Comparação do perfil com os requisitos de cada vaga e apresentação de uma justificativa de aderência.
4. Geração de uma versão de currículo direcionada à vaga, preservando a veracidade das informações do usuário.
5. Revisão e aprovação do usuário antes de qualquer candidatura externa.