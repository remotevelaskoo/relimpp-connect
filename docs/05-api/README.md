# API Book

- Documento: API do Relimpp Connect (Core Platform + módulo de Compras)
- Fonte da verdade: controllers em [`backend/src`](../../backend/src) + Swagger gerado em runtime
  (`GET /api/v1/docs`, a partir de `backend/src/main.ts`)
- Status: 🔄 reflete o **MVP 0/1**. Cresce junto com o código — módulos futuros (Cotação, Pedido,
  Recebimento, Fiscal, Portal do Fornecedor) ainda não têm rota nenhuma.
- Referenciado por: [Blueprint V12](../11-blueprint/README.md), [Database Book](../04-database/README.md)

> Como o [Database Book](../04-database/README.md): este documento é derivado do código real, não uma
> proposta. Ao adicionar/alterar um endpoint, atualize este arquivo no mesmo PR.

## 1. Convenções gerais

- **Base URL:** `http://localhost:3001/api/v1` (prefixo global fixado em `main.ts`).
- **Autenticação:** Bearer JWT (`Authorization: Bearer <token>`), exceto `POST /auth/login`. Segredo via
  `JWT_SECRET` (padrão de dev inseguro: `"dev-secret"` — **trocar em qualquer ambiente real**), expiração
  via `JWT_EXPIRES_IN` (padrão `1h`). **Sem refresh token** ainda — expirado, o usuário precisa logar de novo.
- **Validação:** `ValidationPipe` global com `whitelist: true` (campos não declarados no DTO são
  descartados) e `transform: true`.
- **CORS:** habilitado; origens permitidas via `FRONTEND_ORIGIN` (lista separada por vírgula), ou `*` se a
  variável não estiver definida (**revisar antes de produção**).
- **Erros:** formato padrão do NestJS (`{ statusCode, message, error }`). Principais códigos usados pelos
  services: `404 NotFoundException`, `409 ConflictException` (duplicidade/dependências), `400 BadRequestException`
  (transição de status inválida ou validação de DTO).
- **Paginação:** **não implementada.** Todo `list()` retorna a coleção inteira (`findMany` sem `skip`/`take`).
  Ok para o volume de dados do MVP; será necessário antes de qualquer tabela crescer muito.
- **Auditoria de API:** não há middleware de log de requisição/auditoria ainda — os únicos registros de
  auditoria hoje são os eventos de `PurchaseRequestEvent` (ver seção 4) e os campos `createdBy`/`updatedBy`
  nas entidades que os têm.

## 2. Auth (`/auth`)

| Método | Rota | Auth | Corpo | Retorno |
|---|---|---|---|---|
| `POST` | `/auth/login` | Pública | `{ email, password }` | `{ accessToken, user: { id, name, email, roles[] } }` — `401` se credenciais inválidas ou usuário inativo |
| `GET` | `/auth/me` | Bearer | — | Payload do usuário autenticado (claims do JWT: `sub`, `email`) |

`roles` no retorno de login vem de `user.roleScopes.map(rs => rs.role.key)` — é a lista de **chaves de
papel** (ex. `platform_admin`), sem o escopo de empresa associado a cada papel (ver
[Database Book §3.2](../04-database/README.md#32-usuários-papéis-e-permissões-rbac--adr-0006)).

## 3. Organização: Empresas e Unidades

### 3.1 Empresas (`/companies`)

| Método | Rota | Corpo | Regras |
|---|---|---|---|
| `GET` | `/companies` | — | Lista todas, sem filtro de escopo do usuário chamador ainda. |
| `GET` | `/companies/:id` | — | `404` se não existir. |
| `POST` | `/companies` | `{ name, tradeName?, cnpj?, active? }` | `cnpj` validado estruturalmente (14 dígitos) e normalizado para `xx.xxx.xxx/xxxx-xx`; `409` se `cnpj` duplicado. |
| `PATCH` | `/companies/:id` | Parcial do acima | Incrementa `version`. |
| `DELETE` | `/companies/:id` | — | `409` se existir Branch/Department/Project/CostCenter/User vinculado — **hard delete**, não há soft-delete/inativação forçada aqui (o campo `active` existe mas o delete não o usa como alternativa). |

### 3.2 Unidades organizacionais (`/branches`, `/departments`, `/projects`, `/cost-centers`)

As quatro rotas compartilham o mesmo `BaseOrgUnitController` genérico — mesmo contrato para as quatro:

| Método | Rota | Corpo | Regras |
|---|---|---|---|
| `GET` | `/<recurso>?companyId=` | — | `companyId` opcional; sem filtro, lista de todas as empresas. |
| `GET` | `/<recurso>/:id` | — | `404` se não existir. |
| `POST` | `/<recurso>` | `{ companyId, name, code?, active? }` | Sem unicidade de `code` dentro da empresa (pendência, ver Database Book §6). |
| `PATCH` | `/<recurso>/:id` | Parcial, **exceto `companyId`** (`readOnly`, não pode trocar a empresa da unidade) | |
| `DELETE` | `/<recurso>/:id` | — | Sem guarda de dependências (diferente de `/companies`) — checar antes de expor no admin sem confirmação extra. |

> **Nota de nomenclatura:** a rota `/projects` corresponde à entidade que o produto chama de **"Obras"**
> (ver [Database Book §6.1](../04-database/README.md#6-divergências-conhecidas-entre-o-blueprintespecificação-e-o-schema-atual)).
> O frontend já traduz isso na UI (`/dashboard/obras` chama a API em `/projects`).

## 4. Compras — Solicitação (`/purchase-requests`)

| Método | Rota | Corpo | Regras |
|---|---|---|---|
| `GET` | `/purchase-requests?companyId=` | — | Inclui `requester`, `company` e contagem de itens; `number` (`SC-000123`) calculado a partir de `seq`. |
| `GET` | `/purchase-requests/:id` | — | Inclui `items[]` e `events[]` (timeline, ordenada por `createdAt asc`). |
| `POST` | `/purchase-requests` | `{ companyId, justification, priority?, items: [{ description, specification?, quantity, unit, estimatedPrice? }] }` | `items` exige ao menos 1 (`@ArrayMinSize(1)`); cria em `DRAFT`; gera evento `CREATED`. |
| `PATCH` | `/purchase-requests/:id` | Parcial do create (sem `companyId`) | Só permitido em `DRAFT` ou `RETURNED` (`400` fora disso); se `items` for enviado, **substitui todos os itens** (delete + recreate, não faz merge). |
| `POST` | `/purchase-requests/:id/submit` | — | `DRAFT\|RETURNED → SUBMITTED`. |
| `POST` | `/purchase-requests/:id/approve` | — | `SUBMITTED → APPROVED`. |
| `POST` | `/purchase-requests/:id/reject` | `{ justification }` | `SUBMITTED → REJECTED`; motivo obrigatório (mín. 3 caracteres), vai para a mensagem do evento. |
| `POST` | `/purchase-requests/:id/return` | `{ justification }` | `SUBMITTED → RETURNED`; mesma regra de motivo obrigatório. |
| `POST` | `/purchase-requests/:id/cancel` | `{ reason }` | Permitido a partir de `DRAFT\|SUBMITTED\|RETURNED`; motivo obrigatório. |

Toda transição roda em uma função `transition()` única que: atualiza `status`, incrementa `version`, grava
`updatedBy` e cria um `PurchaseRequestEvent`. Ver a máquina de estados completa e o gap sobre workflow
configurável no [Database Book §3.4](../04-database/README.md#34-módulo-de-compras--solicitação-mvp-1).

**O que a Especificação/Blueprint pedem e ainda não existe nesta rota:** aprovação por alçada/valor,
aprovação paralela ou por maioria, delegação de aprovador, anexos, vínculo com filial/departamento/obra/
centro de custo, e distinção formal solicitante×aprovador por permissão (hoje qualquer usuário autenticado
pode chamar `/approve` — não há checagem de papel ainda).

## 5. Health (`/health`)

| Método | Rota | Auth | Retorno |
|---|---|---|---|
| `GET` | `/health` | Pública | `{ status: "ok"\|"degraded", database: "up"\|"down", timestamp }` — testa o banco com `SELECT 1`. |

## 6. Endpoints previstos e ainda inexistentes

Para não perder o mapeamento entre o que o Blueprint promete e o que a API já cobre:

| Área do Blueprint | Rota esperada (a definir) | Status |
|---|---|---|
| Usuários/Perfis (V07, admin/cadastros/usuarios) | `/users`, `/roles`, `/permissions` (CRUD) | ⬜ só leitura interna via seed; sem controller HTTP para gerenciar. |
| Cotação/Comparação (V03 §3.3) | `/quotations`, `/quotations/:id/invite` | ⬜ nada implementado. |
| Portal do Fornecedor (V08) | `/portal/*` (namespace separado, auth de fornecedor) | ⬜ nada implementado — nem model de Fornecedor existe no schema. |
| Pedido de Compra (V03 §3.4) | `/purchase-orders` | ⬜ nada implementado. |
| Recebimento / Fiscal | `/receipts`, `/fiscal-documents` | ⬜ nada implementado. |
| Busca Global (V04 §1) | `/search?q=` | ⬜ nada implementado. |
| Notificações (V04 §2) | `/notifications` | ⬜ nada implementado — nenhum evento de domínio dispara notificação hoje. |
