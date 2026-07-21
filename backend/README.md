# Backend — Relimpp Connect

API do Core Platform (MVP 0), em NestJS + Prisma + PostgreSQL, organizada como monólito modular
(ver [ADR-0002](../docs/03-architecture/adr/ADR-0002-modular-monolith.md) e
[ADR-0004](../docs/03-architecture/adr/ADR-0004-stack-tecnologico.md)).

## Estrutura

```text
src/
  core/          # infraestrutura transversal: prisma, auth (JWT), health
  platform/      # Core Platform: organization (empresas), users
prisma/          # schema, migrações e seed
```

## Rodando em desenvolvimento

Pré-requisito: PostgreSQL acessível conforme `DATABASE_URL` (ver `infrastructure/docker/docker-compose.dev.yml`).

```bash
cp .env.example .env         # ajuste DATABASE_URL/JWT_SECRET se necessário
npm install                  # instala deps e roda "prisma generate" (postinstall)
npm run prisma:deploy        # aplica migrações (ou: npm run prisma:migrate em dev)
npm run seed                 # cria admin, papéis, permissões e categorias base
npm run start:dev            # sobe a API em http://localhost:3001/api/v1
```

- Documentação OpenAPI: `http://localhost:3001/api/v1/docs`.
- Healthcheck: `GET /api/v1/health`.
- Admin do seed: `admin@relimpp.local` / `Admin@123` (configurável via `SEED_ADMIN_*`).

## Scripts

- `npm run lint` — ESLint.
- `npm test` — Jest.
- `npm run build` — compila para `dist/`.
