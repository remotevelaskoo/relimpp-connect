# ADR-0004 — Stack tecnológico inicial

- Status: Proposed
- Data: 2026-07-21

## Contexto

O `README` registra que as tecnologias ainda deverão ser formalmente aprovadas por ADR. O Apêndice C da [Especificação Funcional Consolidada](../../01-product-book/especificacao-funcional-consolidada.md) já indica uma direção técnica. Iniciar o desenvolvimento exige fixar linguagem, frameworks, ORM, gerenciador de pacotes e a estrutura do repositório, mantendo coerência com o monólito modular (ADR-0002) e a independência de ERP (ADR-0001).

## Decisão proposta

Adotar como stack inicial:

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind, com Design System próprio e abordagem mobile first.
- **Backend:** Node.js + NestJS + TypeScript, organizado como monólito modular (módulos = domínios) com comunicação interna por eventos.
- **Banco de dados:** PostgreSQL, com migrações versionadas em `database/`.
- **ORM:** Prisma como opção preferencial (a confirmar frente a TypeORM na descoberta), decidido de forma única para todo o backend.
- **API:** REST sob `/api/v1`, documentada em OpenAPI.
- **Gerenciador de pacotes:** definição única por projeto (recomendado `pnpm`), com lockfile versionado.
- **Testes:** Jest + Supertest (backend) e Playwright (E2E), conforme o Test Book.
- **Infraestrutura de desenvolvimento:** Docker + Docker Compose, com variáveis de ambiente fora do código.

A estrutura de pastas de referência está descrita na [Análise de Início de Desenvolvimento](../../01-product-book/analise-inicio-desenvolvimento.md#6-arquitetura-de-referência-do-monólito-modular).

## Consequências

- O andaimento dos projetos `backend/` e `frontend/` pode começar assim que esta ADR for aceita.
- A escolha do ORM deve ser fechada antes da primeira migração para evitar retrabalho.
- O update script do ambiente deverá instalar dependências dos novos `package.json` (já preparado condicionalmente).
- Mudança futura de framework/ORM exigirá nova ADR (superseding).
- Padrões de lint, formatação e testes passam a ser obrigatórios na Definition of Done.
