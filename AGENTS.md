# AGENTS.md

## Cursor Cloud specific instructions

### Estado do repositório

O Relimpp Connect saiu da fase documentação-only: o MVP 0 (Fundação) já tem código executável.

- `backend/` — API NestJS + Prisma + PostgreSQL (Core Platform: auth JWT, organização/empresas, health).
- `frontend/` — Next.js (App Router) + Tailwind (login, "Meu Trabalho", empresas).
- `database/` — modelo via Prisma (`backend/prisma/schema.prisma` + `migrations/`).
- `infrastructure/docker/docker-compose.dev.yml` — PostgreSQL para desenvolvimento.
- `docs/` — Product Book, ADRs (0001–0006), análise de início de desenvolvimento, etc.

As tecnologias e decisões estruturais estão registradas em ADRs (`docs/03-architecture/adr`).

### Serviços e como rodar

Comandos padrão estão documentados em `backend/README.md` e `frontend/README.md`. Resumo:

- Backend: `cd backend && npm run start:dev` → `http://localhost:3001/api/v1` (Swagger em `/api/v1/docs`).
- Frontend: `cd frontend && npm run dev` → `http://localhost:3000`.
- Admin do seed: `admin@relimpp.local` / `Admin@123`.

### Dependência de PostgreSQL (gotchas importantes)

- O backend exige PostgreSQL acessível via `DATABASE_URL` (padrão: `relimpp:relimpp@localhost:5432/relimpp_connect`). O `docker-compose.dev.yml` é a forma canônica em máquinas com Docker.
- **Na VM do Cursor Cloud não há Docker.** Instale o PostgreSQL via apt e suba o cluster (ação pontual, fora do update script):
  - `sudo apt-get update && sudo apt-get install -y postgresql`
  - `sudo pg_ctlcluster 16 main start`
  - criar role/DB: role `relimpp` (senha `relimpp`) com `CREATEDB`, e database `relimpp_connect`.
- **Windows sem Docker e sem admin (não dá para instalar o PostgreSQL como serviço):** use
  `infrastructure/local-db-windows/` (`npm install && npm start`) — PostgreSQL real, persistente, mesmas
  credenciais, sem precisar de elevação. Ver o README daquela pasta.
- **`prisma migrate dev` precisa de um shadow database**: o role do banco precisa de permissão `CREATEDB` (`ALTER ROLE relimpp CREATEDB;`). Sem isso, falha com `P3014`. `prisma migrate deploy` não usa shadow DB.
- Os arquivos `.env` (backend) e `.env.local` (frontend) não são versionados; copie de `.env.example`.

### Fluxo de dados / migrações

- Após alterar `schema.prisma`, gere migração com `npm run prisma:migrate` e rode `npm run seed` se necessário.
- `npm install` no backend roda `prisma generate` (postinstall); reinstalar dependências regenera o client automaticamente.

### Lint / testes / build

- Backend: `npm run lint`, `npm test`, `npm run build`.
- Frontend: `npm run lint`, `npm run build`.

### Update script

O update script instala dependências de `backend/` e `frontend/` (npm) apenas quando os respectivos
`package.json` existem. Ele NÃO sobe serviços nem o PostgreSQL — inicie-os conforme acima.
