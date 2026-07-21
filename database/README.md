# Database

O modelo de dados do MVP 0 é gerenciado via **Prisma** no backend. As migrações versionadas ficam em
`backend/prisma/migrations` e o schema em `backend/prisma/schema.prisma`.

Banco: **PostgreSQL** (ver `infrastructure/docker/docker-compose.dev.yml`).

Este diretório documentará, conforme o produto evoluir: dicionário de dados, índices, constraints,
convenções, retenção, auditoria e estratégia multiempresa (ver
[ADR-0005](../docs/03-architecture/adr/ADR-0005-estrategia-multiempresa.md)).

## Comandos úteis (a partir de `backend/`)

- `npm run prisma:migrate` — cria/aplica migração em desenvolvimento.
- `npm run prisma:deploy` — aplica migrações existentes.
- `npm run seed` — popula papéis, permissões, categorias base e usuário administrador.
