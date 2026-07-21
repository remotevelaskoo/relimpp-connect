# Frontend — Relimpp Connect

Aplicação web (MVP 0) em Next.js (App Router) + React + TypeScript + Tailwind
(ver [ADR-0004](../docs/03-architecture/adr/ADR-0004-stack-tecnologico.md)).

## Telas do MVP 0

- `/login` — autenticação.
- `/dashboard` — "Meu Trabalho" (visão inicial por cards).
- `/dashboard/empresas` — cadastro e listagem de empresas (estrutura organizacional).

## Rodando em desenvolvimento

Pré-requisito: backend rodando (ver `../backend`).

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL aponta para a API
npm install
npm run dev                  # http://localhost:3000
```

## Scripts

- `npm run lint` — ESLint (next lint).
- `npm run build` — build de produção.
