# API Book

- Documento: API do Relimpp Connect (Core Platform + Compras + Fornecedores + Usuários/Papéis)
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
  auditoria hoje são os eventos de `PurchaseRequestEvent` (seção 6) e `SupplierEvent` (seção 4), e os
  campos `createdBy`/`updatedBy` nas entidades que os têm.

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

## 4. Fornecedores (Suppliers) (`/suppliers`)

| Método | Rota | Corpo | Regras |
|---|---|---|---|
| `GET` | `/suppliers?companyId=` | — | Lista com `company` incluído. |
| `GET` | `/suppliers/:id` | — | Inclui `events[]` (timeline, ordenada por `createdAt asc`). |
| `POST` | `/suppliers` | `{ companyId, name, tradeName?, cnpj?, email?, phone? }` | Cria em `PRE_REGISTERED`; gera evento `CREATED`; `409` se `(companyId, cnpj)` duplicado. |
| `PATCH` | `/suppliers/:id` | Parcial do create + `active?` (sem `companyId`) | `400` se o fornecedor estiver `BLOCKED`. |
| `DELETE` | `/suppliers/:id` | — | `409` fora de `PRE_REGISTERED` — para os demais status, use `inactivate`. |
| `POST` | `/suppliers/:id/submit-for-review` | — | `PRE_REGISTERED → UNDER_REVIEW`. 🔒 `supplier:submit_for_review`. |
| `POST` | `/suppliers/:id/approve` | `{ restricted?: boolean }` | `UNDER_REVIEW → APPROVED` (ou `RESTRICTED` se `restricted: true`). 🔒 `supplier:approve`. |
| `POST` | `/suppliers/:id/suspend` | `{ reason }` | `APPROVED\|RESTRICTED → SUSPENDED`; motivo obrigatório. 🔒 `supplier:suspend`. |
| `POST` | `/suppliers/:id/block` | `{ reason }` | De qualquer status exceto `BLOCKED\|INACTIVE → BLOCKED`; motivo obrigatório. 🔒 `supplier:block`. |
| `POST` | `/suppliers/:id/reactivate` | — | `SUSPENDED\|BLOCKED → APPROVED`. 🔒 `supplier:reactivate`. |
| `POST` | `/suppliers/:id/inactivate` | `{ reason }` | De qualquer status exceto `BLOCKED → INACTIVE`; motivo obrigatório. 🔒 `supplier:inactivate`. |

Mesmo padrão de `ensureStatus()`/`transition()` do módulo de Compras — ver a máquina de estados completa em
[Database Book §3.5](../04-database/README.md#35-fornecedores--cadastro-e-homologação).

🔒 = exige a permissão indicada via `@RequirePermission` + `PermissionsGuard` (ver
[seção 5.3](#53-como-o-rbac-é-aplicado-permissionsguard)); `platform_admin` sempre passa. `GET`, `POST`
(criar), `PATCH` e `DELETE` de `/suppliers` **não** têm checagem de permissão ainda — qualquer usuário
autenticado pode cadastrar/editar/excluir um fornecedor em `PRE_REGISTERED`.

**O que a Especificação/Blueprint pedem e ainda não existe nesta rota:** endereços, categorias de
fornecimento, dados bancários, documentos com validade/vencimento, avaliação de desempenho e cálculo de
risco. Este `/suppliers` é o cadastro interno — **não** é o Portal do Fornecedor (autenticação externa do
próprio fornecedor), que continua sem nenhuma rota (ver seção 8).

## 5. Usuários, Papéis e Permissões (Users, Roles, Permissions)

### 5.1 Usuários (`/users`)

| Método | Rota | Corpo | Regras |
|---|---|---|---|
Todas as rotas de `/users` exigem 🔒 `user:manage` (guarda de **controller inteiro**, não por ação).

| Método | Rota | Corpo | Regras |
|---|---|---|---|
| `GET` | `/users?companyId=` | — | Inclui `roleScopes[]` (papel + empresa de cada vínculo); **nunca** inclui `passwordHash`. |
| `GET` | `/users/:id` | — | Idem. `404` se não existir. |
| `POST` | `/users` | `{ name, email, password (mín. 8), companyId? }` | Senha com `bcrypt` (10 rounds); `409` se `email` duplicado (único globalmente, não por empresa). |
| `PATCH` | `/users/:id` | `{ name?, email?, companyId?, active? }` | **Não** aceita `password` neste endpoint (bloqueado no DTO) — usar `/set-password`. |
| `POST` | `/users/:id/set-password` | `{ password (mín. 8) }` | Rehash e substitui; não invalida tokens já emitidos (sem blacklist de JWT). |
| `POST` | `/users/:id/role-scopes` | `{ roleId, companyId? }` | Cria um vínculo `UserRoleScope`. `companyId` omitido = papel global (todas as empresas). Não impede duplicar o mesmo papel+escopo duas vezes (sem `@@unique` no schema). |
| `DELETE` | `/users/:id/role-scopes/:roleScopeId` | — | Remove um vínculo específico; `404` se o `roleScopeId` não pertencer a este usuário. |

**Sem endpoint de exclusão de usuário** (proposital — Apêndice B da Especificação: "nenhum registro crítico
deve ser excluído fisicamente"). Para desativar, use `PATCH { active: false }`.

### 5.2 Papéis (`/roles`) e Permissões (`/permissions`)

Mesma regra: todas as rotas de `/roles` e `/permissions` exigem 🔒 `user:manage`.

| Método | Rota | Corpo | Regras |
|---|---|---|---|
| `GET` | `/roles` | — | Inclui `permissions[]` (join com `Permission`). |
| `GET` | `/roles/:id` | — | Idem. |
| `POST` | `/roles` | `{ key (snake_case), name, description? }` | `409` se `key` duplicada. |
| `PATCH` | `/roles/:id` | `{ name?, description? }` | `key` é imutável após criado. |
| `PATCH` | `/roles/:id/permissions` | `{ permissionIds: string[] }` | **Substitui o conjunto inteiro** (delete-all + insert, numa transação) — não é incremental. `404` se algum id não existir. |
| `GET` | `/permissions` | — | Lista fixa: as 5 originais (`company:view/create/edit`, `user:view/create`) mais `user:manage` e as permissões de ação de Compras/Fornecedores (seção 5.3). Sem `POST` — criar novas permissões ainda exige alterar o seed. |

### 5.3 Como o RBAC é aplicado (`PermissionsGuard`)

Desde este volume, permissão deixou de ser só um cadastro e passou a ser **verificada** em algumas rotas:

- Decorator `@RequirePermission('recurso:ação')` marca a rota (ou o controller inteiro); `PermissionsGuard`
  lê essa metadata via `Reflector` e busca, no banco, todos os `UserRoleScope` do usuário autenticado — se
  **algum** papel dele tiver a permissão exigida (em qualquer escopo de empresa) **ou** o papel for
  `platform_admin` (bypass total, sempre passa), a requisição segue; senão, `403 Forbidden` com uma mensagem
  citando a permissão que faltou.
- A checagem é **por papel**, não por escopo de empresa: um `Gestor de Área` só vinculado à Empresa A ainda
  consegue aprovar uma solicitação da Empresa B — o filtro fica só no `companyId` da query, não na
  autorização (mesmo gap de escopo documentado no [Database Book §6.2](../04-database/README.md#6-divergências-conhecidas-entre-o-blueprintespecificação-e-o-schema-atual)).
- Permissões seedadas por papel (`backend/prisma/seed.ts`, `ROLE_PERMISSIONS`): `requester` → submeter/
  cancelar solicitação; `area_manager`/`director` → aprovar/rejeitar/devolver solicitação; `buyer` →
  submeter/cancelar solicitação e todas as ações de homologação de fornecedor; `platform_admin` → tudo,
  sempre.
- **Rotas ainda sem `@RequirePermission`** (qualquer autenticado pode chamar): CRUD de Empresas/Filiais/
  Departamentos/Obras/Centros de Custo, criar/editar/excluir Solicitação e Fornecedor (só as **transições de
  status** têm dono). Ver [Database Book §6.4](../04-database/README.md#6-divergências-conhecidas-entre-o-blueprintespecificação-e-o-schema-atual)
  para o inventário completo do que falta (segregação de funções, alçada por valor, aprovação paralela).

## 6. Compras — Solicitação (`/purchase-requests`)

| Método | Rota | Corpo | Regras |
|---|---|---|---|
| `GET` | `/purchase-requests?companyId=` | — | Inclui `requester`, `company` e contagem de itens; `number` (`SC-000123`) calculado a partir de `seq`. |
| `GET` | `/purchase-requests/:id` | — | Inclui `items[]` e `events[]` (timeline, ordenada por `createdAt asc`). |
| `POST` | `/purchase-requests` | `{ companyId, justification, priority?, items: [{ description, specification?, quantity, unit, estimatedPrice? }] }` | `items` exige ao menos 1 (`@ArrayMinSize(1)`); cria em `DRAFT`; gera evento `CREATED`. |
| `PATCH` | `/purchase-requests/:id` | Parcial do create (sem `companyId`) | Só permitido em `DRAFT` ou `RETURNED` (`400` fora disso); se `items` for enviado, **substitui todos os itens** (delete + recreate, não faz merge). |
| `POST` | `/purchase-requests/:id/submit` | — | `DRAFT\|RETURNED → SUBMITTED`. 🔒 `purchase_request:submit`. |
| `POST` | `/purchase-requests/:id/approve` | — | `SUBMITTED → APPROVED`. 🔒 `purchase_request:approve`. |
| `POST` | `/purchase-requests/:id/reject` | `{ justification }` | `SUBMITTED → REJECTED`; motivo obrigatório (mín. 3 caracteres), vai para a mensagem do evento. 🔒 `purchase_request:reject`. |
| `POST` | `/purchase-requests/:id/return` | `{ justification }` | `SUBMITTED → RETURNED`; mesma regra de motivo obrigatório. 🔒 `purchase_request:return`. |
| `POST` | `/purchase-requests/:id/cancel` | `{ reason }` | Permitido a partir de `DRAFT\|SUBMITTED\|RETURNED`; motivo obrigatório. 🔒 `purchase_request:cancel`. |

🔒 = exige a permissão indicada, ver [seção 5.3](#53-como-o-rbac-é-aplicado-permissionsguard). `GET`,
`POST` (criar) e `PATCH` continuam sem checagem — o solicitante consegue editar a solicitação de qualquer
pessoa, não só a própria (nenhuma noção de "dono" no service ainda).

Toda transição roda em uma função `transition()` única que: atualiza `status`, incrementa `version`, grava
`updatedBy` e cria um `PurchaseRequestEvent`. Ver a máquina de estados completa e o gap sobre workflow
configurável no [Database Book §3.4](../04-database/README.md#34-módulo-de-compras--solicitação-mvp-1).

**O que a Especificação/Blueprint pedem e ainda não existe nesta rota:** aprovação por alçada/valor,
aprovação paralela ou por maioria, delegação de aprovador, anexos, e vínculo com filial/departamento/obra/
centro de custo.

## 7. Health (`/health`)

| Método | Rota | Auth | Retorno |
|---|---|---|---|
| `GET` | `/health` | Pública | `{ status: "ok"\|"degraded", database: "up"\|"down", timestamp }` — testa o banco com `SELECT 1`. |

## 8. Endpoints previstos e ainda inexistentes

Para não perder o mapeamento entre o que o Blueprint promete e o que a API já cobre:

| Área do Blueprint | Rota esperada (a definir) | Status |
|---|---|---|
| Cotação/Comparação (V03 §3.3) | `/quotations`, `/quotations/:id/invite` | ⬜ nada implementado. |
| Portal do Fornecedor (V08) | `/portal/*` (namespace separado, auth de fornecedor) | ⬜ nada implementado. O cadastro **interno** de fornecedor já existe (seção 4), mas o Portal (login e ações do próprio fornecedor) é auth/UI separado e continua sem nenhuma rota. |
| Pedido de Compra (V03 §3.4) | `/purchase-orders` | ⬜ nada implementado. |
| Recebimento / Fiscal | `/receipts`, `/fiscal-documents` | ⬜ nada implementado. |
| Busca Global (V04 §1) | `/search?q=` | ⬜ nada implementado. |
| Notificações (V04 §2) | `/notifications` | ⬜ nada implementado — nenhum evento de domínio dispara notificação hoje. |
