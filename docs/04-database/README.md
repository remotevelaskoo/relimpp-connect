# Database Book

- Documento: Modelo de dados do Relimpp Connect (Core Platform + Compras + Fornecedores)
- Fonte da verdade: [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma)
- Status: 🔄 reflete o schema do **MVP 0/1** (fundação + solicitação de compra + fornecedores). Cresce junto com o código.
- Referenciado por: [Blueprint V11](../11-blueprint/README.md), [ADR-0005 — Estratégia multiempresa](../03-architecture/adr/ADR-0005-estrategia-multiempresa.md)

> Este documento é gerado/atualizado a partir do schema real, não é uma proposta. Qualquer divergência
> entre este arquivo e `schema.prisma` deve ser tratada como bug de documentação — o schema manda.

## 1. Visão geral

- **Banco:** PostgreSQL. **ORM:** Prisma.
- **Estratégia multitenant (ADR-0005):** banco único, schema único, isolamento lógico por `companyId` em
  cada tabela de negócio. **Row-Level Security ainda não implementada** — hoje o isolamento depende
  inteiramente dos filtros aplicados nos services do NestJS (ver nota de risco na seção 6).
- **Convenções de toda tabela:** `id` UUID (`@default(uuid())`), `createdAt`/`updatedAt` automáticos.
  Entidades de negócio (Company, User, PurchaseRequest) também têm `createdBy`/`updatedBy` e `version`
  (contador incrementado a cada update — controle otimista simples, sem lock real ainda).

## 2. Diagrama de entidades (ER simplificado)

```text
Company 1──* Branch
Company 1──* Department
Company 1──* Project            (= "Obras" no produto/UI)
Company 1──* CostCenter
Company 1──* User
Company 1──* PurchaseRequest
Company 1──* Supplier

User 1──* UserRoleScope *──1 Role 1──* RolePermission *──1 Permission

PurchaseRequest 1──* PurchaseRequestItem
PurchaseRequest 1──* PurchaseRequestEvent
PurchaseRequest *──1 Company
PurchaseRequest *──1 User (requester)

Supplier 1──* SupplierEvent
Supplier *──1 Company

Category  (tabela solta, sem FK — classificação genérica por "type")
```

## 3. Dicionário de dados

### 3.1 Estrutura organizacional (tenant = `Company`)

| Tabela | Campos próprios | Relacionamentos | Observações |
|---|---|---|---|
| **Company** | `name`, `tradeName?`, `cnpj?` (único), `active` | 1—N: Branch, Department, Project, CostCenter, User, UserRoleScope, PurchaseRequest | É o **tenant raiz** (ADR-0005). `cnpj` normalizado no formato `xx.xxx.xxx/xxxx-xx` por `formatCnpj()`; validação estrutural de 14 dígitos (`@IsCnpj`), **sem** dígito verificador por enquanto. |
| **Branch** (Filiais) | `name`, `code?`, `active` | N—1 Company | `@@index([companyId])` |
| **Department** (Departamentos) | `name`, `code?`, `active` | N—1 Company | idem |
| **Project** (**Obras** na UI/produto) | `name`, `code?`, `active` | N—1 Company | O nome do model é `Project`; o produto e o Blueprint chamam esta entidade de "Obras" — ver nota na seção 6. |
| **CostCenter** (Centros de Custo) | `name`, `code?`, `active` | N—1 Company | idem |

> As quatro tabelas acima (Branch/Department/Project/CostCenter) são estruturalmente idênticas e servidas
> por um único `OrgUnitService` genérico no backend (ver [API Book](../05-api/README.md#3-organização-empresas-e-unidades)).
> Ainda **não têm** unicidade de `code` por empresa — pendência de validação de negócio.

### 3.2 Usuários, papéis e permissões (RBAC — ADR-0006)

| Tabela | Campos próprios | Relacionamentos | Observações |
|---|---|---|---|
| **User** | `name`, `email` (único, global — não por empresa), `passwordHash`, `active` | N—1 Company (opcional), 1—N UserRoleScope, 1—N PurchaseRequest | `companyId` é **opcional** no schema — hoje o admin seed não tem empresa vinculada. |
| **Role** | `key` (único, ex. `platform_admin`), `name`, `description?` | 1—N RolePermission, 1—N UserRoleScope | Papéis do MVP: `platform_admin`, `director`, `area_manager`, `requester`, `buyer`, `receiving`, `fiscal`, `auditor` (seed) — falta `fornecedor` como Role explícita (Portal do Fornecedor ainda não modelado). |
| **Permission** | `key` (único, formato `resource:action`, ex. `company:create`), `resource`, `action` | N—N com Role via RolePermission | Só 5 permissões seedadas hoje (`company:view/create/edit`, `user:view/create`) — cobre uma fração pequena das ações do V07 (Blueprint). |
| **RolePermission** | — | PK composta `(roleId, permissionId)` | Tabela de junção pura. |
| **UserRoleScope** | — | N—1 User, N—1 Role, N—1 Company (opcional) | Implementa o modelo "papel + escopo" do V07: um usuário pode ter várias linhas aqui, uma por combinação papel×empresa. **Ainda não tem** escopo por filial/departamento/obra/centro de custo — só por empresa. |

### 3.3 Categorias

| Tabela | Campos | Observações |
|---|---|---|
| **Category** | `type` (ex. `purchase`, `supplier`, `document`), `key`, `name`, `active` | `@@unique([type, key])`. Sem FK — é usada por convenção de `type` string, não por relação. Hoje só seedada para `purchase`, `supplier` e `document`; o V02/Cadastros prevê também categorias de produto/serviço. |

### 3.4 Módulo de Compras — Solicitação (MVP 1)

| Tabela | Campos próprios | Relacionamentos | Observações |
|---|---|---|---|
| **PurchaseRequest** | `seq` (autoincrement, vira número exibível `SC-000123`), `justification`, `priority` (`low\|medium\|high\|urgent`), `status` (ver máquina de estados abaixo) | N—1 Company, N—1 User (requester), 1—N PurchaseRequestItem, 1—N PurchaseRequestEvent | `@@index([companyId])`, `@@index([status])`. **Não tem ainda** `branchId`/`departmentId`/`projectId`/`costCenterId` — a Especificação (seção 8.1) prevê esses vínculos, mas o schema atual só escopa por `companyId`. |
| **PurchaseRequestItem** | `description`, `specification?`, `quantity` (Float), `unit`, `estimatedPrice?` | N—1 PurchaseRequest (`onDelete: Cascade`) | Não referencia `Category` nem um catálogo de produto — descrição livre por enquanto (catálogo corporativo é módulo futuro). |
| **PurchaseRequestEvent** | `type`, `message`, `actorId?` | N—1 PurchaseRequest (`onDelete: Cascade`) | É a **timeline** da solicitação (ver [V03 §4](../11-blueprint/v03-mapa-navegacao.md#4-fluxo-interno-padrão-de-uma-tela-de-processo)). Guarda só texto — sem diff estruturado de campos alterados (Apêndice B da Especificação pede "valor anterior e novo" em alterações críticas; ainda não implementado). |

#### Máquina de estados de `PurchaseRequest.status`

```text
DRAFT ──submit──▶ SUBMITTED ──approve──▶ APPROVED
  │                   │
  │                   ├──reject────────▶ REJECTED
  │                   └──return────────▶ RETURNED ──submit──▶ SUBMITTED (repete)
  │
  └──cancel──▶ CANCELLED   (permitido a partir de DRAFT, SUBMITTED ou RETURNED)
```

Todas as transições são validadas por `ensureStatus()` no `PurchaseRequestService` — uma ação fora do
status permitido retorna `400 Bad Request`. Isso é o Workflow Engine simplificado do MVP; o V07/V09 do
Blueprint preveem um motor de workflow configurável (etapas, alçadas, aprovação paralela) que **ainda não
existe** — hoje é um fluxo sequencial fixo, hardcoded no service.

### 3.5 Fornecedores — cadastro e homologação

| Tabela | Campos próprios | Relacionamentos | Observações |
|---|---|---|---|
| **Supplier** | `name`, `tradeName?`, `cnpj?`, `email?`, `phone?`, `status` (ver máquina de estados abaixo), `active` | N—1 Company, 1—N SupplierEvent | `@@unique([companyId, cnpj])` — mesmo CNPJ pode existir em empresas diferentes, mas não duas vezes na mesma empresa (múltiplos `cnpj = null` são permitidos, o Postgres não considera `NULL` colisão de unicidade). **Sem** endereços, categorias de fornecimento ou dados bancários ainda — a Especificação (seção 10) prevê esses campos. |
| **SupplierEvent** | `type`, `message`, `actorId?` | N—1 Supplier (`onDelete: Cascade`) | Timeline do fornecedor, mesmo padrão de `PurchaseRequestEvent`. |

#### Máquina de estados de `Supplier.status`

```text
PRE_REGISTERED ──submit-for-review──▶ UNDER_REVIEW ──approve────────▶ APPROVED ─┐
        │                                    │                                  │
        │                                    └──approve(restricted)──▶ RESTRICTED│
        │                                                                        │
        ├──block──────────────────────────────────────────────────────▶ BLOCKED  │◀── suspend
        ├──inactivate─────────────────────────────────────────────────▶ INACTIVE │
        │                                                                        │
        └── (a partir de UNDER_REVIEW/APPROVED/RESTRICTED/SUSPENDED também podem ir a BLOCKED/INACTIVE)

SUSPENDED ──reactivate──▶ APPROVED          BLOCKED ──reactivate──▶ APPROVED
```

Mesmo padrão de `ensureStatus()`/`transition()` do `PurchaseRequestService` — ver
[API Book §4](../05-api/README.md#4-fornecedores-suppliers) para a lista de transições permitidas por
status. `suspend`, `block` e `inactivate` exigem motivo (mín. 3 caracteres), gravado na mensagem do evento.

## 4. Migrações

| Migração | O que adiciona |
|---|---|
| `20260721192635_init` | Schema inicial completo (organização, RBAC, categorias). |
| `20260721200254_add_department_code` | Adiciona `code` a `Department`. |
| `20260721210854_purchasing_requests` | Tabelas `PurchaseRequest`, `PurchaseRequestItem`, `PurchaseRequestEvent`. |
| `20260721213000_add_suppliers` | Tabelas `Supplier`, `SupplierEvent`. **Escrita à mão** (sem `prisma migrate dev`) — este ambiente não tinha PostgreSQL disponível para gerar a migração automaticamente; a sintaxe segue exatamente o padrão das migrações anteriores. Rode `prisma migrate deploy` (ou `db push` num ambiente de teste) para validar antes do próximo `migrate dev`. |

Gerar nova migração: `cd backend && npm run prisma:migrate` (ver [AGENTS.md](../../AGENTS.md) para o
gotcha de shadow database em ambientes sem Docker).

## 5. Seed (`backend/prisma/seed.ts`)

- 8 papéis (ver seção 3.2), 5 permissões, 8 categorias.
- `platform_admin` recebe **todas** as permissões existentes automaticamente.
- Usuário admin: `admin@relimpp.local` / `Admin@123` (configurável via `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`).

## 6. Divergências conhecidas entre o Blueprint/Especificação e o schema atual

Registradas aqui para não serem perdidas — tratar como backlog de modelagem, não como erro:

1. **Nomenclatura Project vs. Obras.** O schema usa `Project`/`projects` (API) mas o produto, o menu (V02)
   e a UI chamam essa entidade de "Obras". Decidir se o nome técnico muda para `Site`/`Obra` ou se a
   tradução na camada de apresentação é suficiente — hoje só a UI traduz.
2. **Escopo organizacional incompleto.** `UserRoleScope` e `PurchaseRequest` só têm `companyId`. O V07
   (Perfis e Permissões) e a Especificação (seção 5) definem escopo também por filial, departamento, obra
   e centro de custo — falta estender o schema quando esse nível de granularidade for necessário.
3. **RLS não implementada.** ADR-0005 propõe Row-Level Security como camada adicional; hoje o isolamento é
   só por filtro de aplicação (`where: { companyId }` nos services). Risco: um service que esqueça o
   filtro vaza dados entre empresas.
4. **RBAC minimalista.** Só 5 permissões seedadas; o modelo de ações do V07 (visualizar, criar, editar,
   cancelar, aprovar, rejeitar, reabrir, exportar, administrar — por recurso) ainda não está totalmente
   representado em `Permission`.
5. **Sem tabela de Produto/Catálogo, Cotação, Pedido, Recebimento ou Documento fiscal.** `Supplier` já
   existe (seção 3.5), mas o schema ainda cobre só Fundação + Solicitação de Compra + Cadastro/Homologação
   de Fornecedor (Fase 1–2 do roadmap, [V01 §4](../11-blueprint/v01-visao-modulos-escopo.md#4-escopo-por-fase-alinhado-ao-roadmap)).
   As demais entidades entram quando os módulos correspondentes forem implementados (Onda 2/3 do Blueprint).
6. **`version` é um contador, não um lock otimista real.** Incrementa a cada update mas nenhuma rota
   ainda valida `version` recebida vs. atual antes de gravar — colisões concorrentes não são detectadas.
