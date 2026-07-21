# ADR-0005 — Estratégia multiempresa (multi-tenant)

- Status: Proposed
- Data: 2026-07-21

## Contexto

A plataforma controla acesso e dados por empresa, filial, departamento, obra e centro de custo, e uma mesma pessoa pode ter papéis diferentes em contextos distintos (seções 5 e 6 da [Especificação Funcional Consolidada](../../01-product-book/especificacao-funcional-consolidada.md)). O modelo de isolamento de dados condiciona o esquema de banco, as consultas, a segurança e o desempenho, por isso precisa ser decidido antes da primeira migração.

## Decisão proposta

Adotar, para o MVP, **banco único e schema único com coluna de tenant (`companyId`) e escopo organizacional em todas as tabelas de negócio**, reforçado por:

- filtros de consulta obrigatórios por tenant/escopo aplicados no backend (guards/interceptors do NestJS);
- **Row-Level Security (RLS)** no PostgreSQL como camada adicional de proteção, quando aplicável;
- escopo organizacional (`branchId`, `departmentId`, `projectId`, `costCenterId`) presente nas entidades cujo acesso depende dele.

Alternativas consideradas, a registrar com trade-offs: schema por empresa e banco por empresa. São mais isoladas, porém mais custosas operacionalmente e desnecessárias para o número inicial de empresas.

## Consequências

- Toda tabela de negócio nasce com escopo de tenant; migrações e seeds seguem esse padrão.
- Há risco de vazamento entre tenants se um filtro for esquecido — mitigado por RLS e por testes de permissão dedicados.
- Consultas e índices devem considerar `companyId` como prefixo natural.
- Uma futura necessidade de isolamento físico (ex.: exigência contratual) exigirá nova ADR.
