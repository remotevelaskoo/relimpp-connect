# Análise para Início de Desenvolvimento — Relimpp Connect

- Documento: Análise técnica de início de desenvolvimento
- Versão: 0.1
- Data: 2026-07-21
- Base: [Especificação Funcional Consolidada v1.0](especificacao-funcional-consolidada.md)
- Status: Proposta para validação (não substitui a descoberta com a Relimpp)

> Este documento traduz a Especificação Funcional Consolidada em um plano acionável de engenharia:
> arquitetura de referência, domínios, modelo de dados inicial, catálogo de eventos, recorte de MVP,
> backlog de partida com critérios de aceite e passos concretos de andaimento (scaffolding).
> Ele respeita a governança do produto ("documentação antes do desenvolvimento", Artigo 7 e 10 da
> [Constituição](../00-governance/constitution.md)): as decisões estruturais estão registradas como ADRs
> propostas, a serem ratificadas antes de escrever código de produção.

---

## 1. Objetivo desta análise

Preparar o início do desenvolvimento do Relimpp Connect com o menor risco possível, definindo:

1. o que já está decidido e o que precisa ser decidido (ADRs) antes de codar;
2. como a especificação funcional se converte em arquitetura, domínios e dados;
3. qual é o primeiro recorte entregável (fatia vertical) e seu backlog com critérios de aceite;
4. como montar o esqueleto técnico dos projetos `backend/`, `frontend/`, `database/` e `infrastructure/`;
5. quais pendências de validação bloqueiam ou aumentam o risco do desenvolvimento.

## 2. Resumo do entendimento do sistema

O Relimpp Connect é uma **plataforma corporativa modular, configurável e independente de ERP**. A operação gira em torno de **processos rastreáveis** (workflow first), **painéis por perfil** (dashboard first) e **configuração no-code** (workflow, formulários, alçadas, SLA, notificações, permissões).

Três camadas:

- **Experiência única** — dashboards e a área "Meu Trabalho" por perfil.
- **Core Platform** — capacidades compartilhadas: organização, usuários/perfis, workflow, formulários, documentos, timeline, notificações, SLA, auditoria, dashboards, eventos e integração.
- **Módulos de negócio** — Compras é o primeiro; depois Fornecedores, Catálogo, Recebimento e Fiscal.
- **Integração opcional e desacoplada** — TOTVS RM e outros, com fila/log/reprocessamento; nunca no caminho crítico.

O processo espinha-dorsal (Compras) é: `Necessidade → Solicitação → Aprovação → Cotação → Comparação/Seleção → Pedido → Entrega/Recebimento → Confirmação → Validação Fiscal → Conclusão`.

## 3. Do funcional ao técnico — decisões já registradas

As ADRs existentes cobrem três pilares e devem ser respeitadas desde o primeiro commit de código:

| ADR | Decisão | Impacto no desenvolvimento |
|---|---|---|
| [ADR-0001](../03-architecture/adr/ADR-0001-independent-from-erp.md) (Accepted) | Independência de ERP | Cadastros e regras próprios; integração só em camada desacoplada com fila/log. |
| [ADR-0002](../03-architecture/adr/ADR-0002-modular-monolith.md) (Proposed) | Monólito modular | Um deploy, domínios isolados por módulo, comunicação interna por eventos. |
| [ADR-0003](../03-architecture/adr/ADR-0003-configurable-workflows.md) (Accepted) | Workflows configuráveis | Fluxos/alçadas/SLA como configuração versionada executada por um motor. |

## 4. Decisões que faltam para iniciar (novas ADRs propostas)

O `README` afirma que "as tecnologias ainda deverão ser formalmente aprovadas por ADR". O Apêndice C da especificação já dá a direção. Para destravar o desenvolvimento com governança, esta análise propõe três novas ADRs:

| ADR proposta | Tema | Por que é bloqueante |
|---|---|---|
| [ADR-0004](../03-architecture/adr/ADR-0004-stack-tecnologico.md) | Stack tecnológico | Define linguagem, frameworks, ORM, gerenciador de pacotes e estrutura de repositório. |
| [ADR-0005](../03-architecture/adr/ADR-0005-estrategia-multiempresa.md) | Estratégia multiempresa | Toda tabela e consulta dependem do modelo de tenant/escopo escolhido. |
| [ADR-0006](../03-architecture/adr/ADR-0006-autenticacao-e-autorizacao.md) | Autenticação e autorização | RBAC + escopo organizacional + alçadas condicionam API, dados e testes. |

> Recomenda-se ratificar ADR-0002, ADR-0004, ADR-0005 e ADR-0006 na reunião de descoberta antes do primeiro código de produção.

## 5. Stack proposto (detalhamento em ADR-0004)

| Camada | Tecnologia proposta | Observações |
|---|---|---|
| Frontend | Next.js (App Router) + React + TypeScript + Tailwind | Design System próprio; mobile first; SSR/ISR onde fizer sentido. |
| Backend | Node.js + NestJS + TypeScript | Monólito modular; módulos = domínios; eventos internos. |
| ORM/DB | Prisma **ou** TypeORM + PostgreSQL | ORM a ratificar em ADR-0004; migrações versionadas em `database/`. |
| API | REST `/api/v1` documentada em OpenAPI | Cada operação documenta auth, permissão, escopo, erros, eventos e auditoria. |
| Auth | JWT/sessão segura + RBAC + escopo | MFA fica como evolução futura. |
| Mensageria interna | EventEmitter/`@nestjs/cqrs` no início; fila (BullMQ/Redis) para integrações | Começar simples; fila entra com a camada de integração. |
| Testes | Jest (unit/integração) + Supertest (API) + Playwright (E2E) | Alinhado ao [Test Book](../08-testing/README.md). |
| Infra | Docker + Docker Compose (dev) + CI/CD | Ambientes dev/homologação/produção separados. |
| Observabilidade | Logs estruturados + métricas + tracing | Requisito não funcional; incluir `correlationId` desde o início. |

## 6. Arquitetura de referência do monólito modular

Estrutura de pastas **proposta** (a ser criada quando ADR-0004 for aceita — ainda não existe código):

```text
backend/                      # NestJS
  src/
    core/                     # infra transversal: config, db, auth, rbac, events, audit, logging
    platform/                 # Core Platform (capacidades compartilhadas)
      organization/           # empresas, filiais, departamentos, obras, centros de custo
      users/                  # usuários, perfis, vínculos organizacionais
      workflow/               # Workflow Engine (definições versionadas + runtime)
      forms/                  # Form Builder
      documents/              # Document Service
      timeline/               # Timeline e auditoria
      notifications/          # Notification Engine
      sla/                    # SLA Engine
      dashboards/             # Dashboard Engine
    modules/                  # módulos de negócio
      purchasing/             # solicitações, cotações, pedidos
      suppliers/              # fornecedores + portal
      catalog/                # catálogo corporativo
      receiving/              # recebimento e confirmação
      fiscal/                 # documentos fiscais
    integration/              # Integration Layer (desacoplada)
frontend/                     # Next.js
  src/app/                    # rotas por área de menu (Início, Meu Trabalho, Compras, ...)
  src/components/             # Design System
  src/lib/                    # cliente de API, auth, permissões
database/
  migrations/                 # migrações versionadas
  seeds/                      # dados iniciais (perfis, categorias base)
infrastructure/
  docker/                     # Dockerfiles e docker-compose.dev
  ci/                         # pipelines
```

Regras de dependência entre módulos (fiscalizadas conforme ADR-0002):

- Módulos de negócio dependem do `platform/` e do `core/`, **nunca** o contrário.
- Comunicação entre módulos de negócio ocorre **por eventos**, não por chamada direta.
- Nenhum módulo duplica capacidade do Core (Artigo 2 da Constituição).

## 7. Domínios (bounded contexts) e responsabilidades

| Domínio | Responsabilidade central | Eventos que publica (exemplos) |
|---|---|---|
| Organization | Hierarquia empresa/filial/departamento/obra/centro de custo | `OrgUnitCreated`, `OrgUnitUpdated` |
| Users & Access | Usuários, papéis, escopos, delegações | `UserCreated`, `RoleAssigned`, `DelegationStarted` |
| Workflow | Definição e execução de fluxos e alçadas | `WorkflowStepEntered`, `ApprovalCompleted` |
| Forms | Definição de formulários e validação de submissões | `FormPublished` |
| Documents | Anexos, versões, validade | `DocumentAttached`, `DocumentExpiring` |
| Timeline/Audit | Histórico cronológico e trilha de auditoria | (consome eventos de todos) |
| Notifications | Envio multi-canal conforme configuração | (consome eventos) |
| SLA | Prazos, calendário útil, escalonamento | `SlaBreached`, `SlaWarning` |
| Purchasing | Solicitação, cotação, seleção, pedido | `PurchaseRequestCreated`, `QuotationClosed`, `PurchaseOrderIssued` |
| Suppliers | Cadastro, homologação, portal | `SupplierHomologated`, `SupplierBlocked` |
| Catalog | Itens, equivalentes, histórico de preço | `CatalogItemPublished` |
| Receiving | Entrega, divergência, confirmação | `DeliveryReceived`, `RequesterConfirmed` |
| Fiscal | Documento fiscal, conferência, integração | `FiscalValidated`, `IntegrationDispatched` |

## 8. Modelo de domínio inicial (entidades núcleo + Compras)

Entidades essenciais para a Fundação e a primeira fatia de Compras (dicionário detalhado irá para o [Database Book](../04-database/README.md)):

- **Núcleo/organização:** `Company`, `Branch`, `Department`, `Project` (obra), `CostCenter`, `User`, `Role`, `Permission`, `UserRoleScope` (papel + escopo), `Delegation`.
- **Motores configuráveis:** `WorkflowDefinition` (versionada), `WorkflowInstance`, `WorkflowStep`, `ApprovalRule` (alçada), `FormDefinition`, `FormSubmission`, `SlaPolicy`, `NotificationTemplate`.
- **Transversais:** `Document`, `TimelineEvent`, `AuditLog`, `DomainEvent` (outbox), `Attachment`.
- **Compras (fatia inicial):** `PurchaseRequest`, `PurchaseRequestItem`, `PurchaseRequestApproval`, `Category`.
- **Compras (fases seguintes):** `CatalogItem`, `Supplier`, `SupplierDocument`, `QuotationRound`, `QuotationInvite`, `QuotationProposal`, `PurchaseOrder`, `PurchaseOrderItem`, `GoodsReceipt`, `FiscalDocument`.

Padrões de dados obrigatórios (derivados do Apêndice B e da seção 21):

- Toda entidade multiempresa carrega escopo organizacional (ver ADR-0005).
- Campos de auditoria em todas as tabelas: `createdBy/At`, `updatedBy/At`, `version`.
- **Sem exclusão física** de registros críticos — usar cancelamento/soft delete com motivo.
- Alterações de dados críticos guardam valor anterior e novo (via `AuditLog`).
- Integrações usam `correlationId` e são idempotentes.

## 9. Catálogo de eventos (Event Engine)

A espinha dorsal de notificações, dashboards, timeline e integrações é o evento de domínio. Eventos mínimos para o MVP de Compras (nomes conforme seção 18.3 da especificação):

`PurchaseRequestCreated` · `PurchaseRequestSubmitted` · `PurchaseRequestReturned` · `ApprovalCompleted` · `QuotationOpened` · `QuotationClosed` · `SupplierSelected` · `PurchaseOrderIssued` · `PurchaseOrderAccepted` · `DeliveryReceived` · `RequesterConfirmed` · `FiscalValidated`.

Recomendação técnica: **outbox pattern** (tabela `DomainEvent`) para garantir consistência entre a transação de negócio e a publicação do evento; consumidores (timeline, notificações, SLA, integração) reagem de forma assíncrona.

## 10. Estratégia multiempresa (resumo — ADR-0005)

A especificação exige escopo por empresa, filial, departamento, obra e centro de custo, com uma mesma pessoa podendo ter papéis diferentes por contexto. Opção recomendada para o MVP:

- **Banco único, schema único, com coluna de tenant (`companyId`) e escopo organizacional em todas as tabelas de negócio**, mais isolamento reforçado por *guards*/`query filters` no NestJS e, quando disponível, **Row-Level Security** no PostgreSQL.
- Alternativas (schema por empresa; banco por empresa) ficam registradas na ADR-0005 com trade-offs; recomendação inicial é a mais simples e escalável para poucas empresas.

## 11. Segurança, permissões e auditoria (resumo — ADR-0006)

- **Autenticação:** JWT de curta duração + refresh; política de senha, bloqueio e expiração; MFA como evolução.
- **Autorização:** RBAC com **ação × recurso × escopo** (ex.: `purchase_request:approve` no escopo de uma obra), mais **alçadas** por valor/categoria e **segregação de funções**.
- **Auditoria/LGPD:** trilha imutável para acesso, alteração, decisão e exportação; dados sensíveis mascarados por perfil; exportações registradas.

## 12. Motores configuráveis — abordagem incremental

Para não travar a Fundação tentando construir motores completos, adotar entrega incremental:

| Motor | MVP 0 (Fundação) | Evolução |
|---|---|---|
| Workflow | Definição versionada + execução sequencial e por alçada | Paralela, maioria, condicional, automática |
| Form Builder | Campos básicos + validação + anexos | Regras condicionais, cálculos, máscaras |
| SLA | Prazo por etapa + lembrete | Calendário útil, pausa, escalonamento |
| Notifications | Interna + e-mail | Push, WhatsApp, preferências |
| Dashboard | Cards/listas por perfil | Widgets configuráveis, filtros avançados |

## 13. Recorte do MVP e primeira fatia vertical

Alinhado ao [roadmap](../10-roadmap/roadmap.md): **MVP 0 — Fundação técnica** primeiro, com uma **fatia vertical fina** que já exercita o Core de ponta a ponta.

**Fatia vertical inicial recomendada:** "Solicitação de compra com aprovação sequencial".

Ela força a existência mínima de: organização, usuários/perfis, autenticação, RBAC/escopo, formulário de solicitação, workflow sequencial, timeline/auditoria, notificação e dashboard "Meu Trabalho". É o menor caminho que prova a arquitetura inteira.

## 14. Backlog de partida — Épicos → Histórias (com critérios de aceite semente)

Mapeado às Epics do backlog macro (seção 24) e aos campos do GitHub Project (`Module`, `MVP`, `Work Type`). Todas as histórias abaixo são **MVP 0 - Foundation**.

### EPIC 01 — Core Platform / Organização & Acesso

- **História:** Como administrador, cadastro empresas, filiais, departamentos, obras e centros de custo.
  - Aceite: criar/editar/inativar unidades; hierarquia consistente; ação registrada na timeline/auditoria.
- **História:** Como administrador, cadastro usuários e atribuo papéis com escopo organizacional.
  - Aceite: usuário recebe papel + escopo; delegação temporária com início/fim; toda alteração auditada.
- **História:** Como usuário, faço login seguro e recupero senha.
  - Aceite: JWT + refresh; bloqueio após N tentativas; expiração de sessão; senha atende à política.

### EPIC 02 — Workflow Engine (mínimo)

- **História:** Como administrador, defino um fluxo sequencial de aprovação versionado.
  - Aceite: definição publicada com autor/data/versão; processos em andamento não mudam retroativamente.
- **História:** Como aprovador, aprovo/rejeito/devolvo com justificativa.
  - Aceite: rejeição/devolução exige justificativa; decisão gera evento `ApprovalCompleted` e entra na timeline.

### EPIC 03 — Form Builder (mínimo) + EPIC 08 — Solicitações

- **História:** Como solicitante, crio e envio uma solicitação de compra (rascunho → enviada).
  - Aceite: valida campos obrigatórios e escopo organizacional; salva rascunho; gera número automático; publica `PurchaseRequestCreated`.
- **História:** Como solicitante, acompanho o status e recebo devoluções para ajuste.
  - Aceite: status conforme Apêndice A; devolução retorna à edição preservando histórico.

### EPIC 01 (transversal) — Timeline, Auditoria e "Meu Trabalho"

- **História:** Como usuário, vejo em "Meu Trabalho" minhas pendências e aprovações.
  - Aceite: lista aprovações pendentes e solicitações devolvidas; atualiza ao reagir a eventos.
- **História:** Todo registro crítico possui timeline cronológica e trilha de auditoria imutável.
  - Aceite: criação, edição, transição e decisão aparecem em ordem; sem exclusão física.

### EPIC 04 — Notification (mínimo)

- **História:** Como aprovador, recebo notificação quando há solicitação aguardando minha aprovação.
  - Aceite: notificação interna + e-mail; notificações críticas não desativáveis.

## 15. Passos de andaimento do repositório (quando ADR-0004 for aceita)

Sequência sugerida (cada item vira uma `TASK` de Infraestrutura):

1. `docker-compose.dev` com PostgreSQL; variáveis de ambiente fora do código (`.env.example`).
2. Scaffolding do backend NestJS em `backend/` com módulos `core/` e `platform/organization` + healthcheck.
3. Configuração de ORM e primeira migração (`database/migrations`) + seed de perfis e categorias base.
4. Scaffolding do frontend Next.js em `frontend/` com layout de menu e página de login.
5. Contrato OpenAPI inicial em `/api/v1` (auth + organização).
6. Pipeline de CI: lint, testes e build para `backend/` e `frontend/`.
7. Atualizar o **update script** do ambiente para instalar dependências dos novos `package.json` (já preparado de forma condicional em `AGENTS.md`).

> Enquanto o código não existe, este repositório permanece documentação-first. Ver `AGENTS.md` para o estado atual do ambiente e para a evolução do update script.

## 16. Estratégia de testes e qualidade

Alinhada ao [Test Book](../08-testing/README.md) e à Definition of Done ([CONTRIBUTING](../../CONTRIBUTING.md)):

- **Unitários** para regras de domínio (workflow, alçadas, validações de formulário).
- **Integração/contrato** para a API (`/api/v1`) com banco efêmero.
- **E2E** para a fatia vertical (login → criar solicitação → aprovar → ver na timeline).
- **Segurança/permissões** como suíte dedicada (RBAC + escopo + segregação de funções).
- Nenhuma funcionalidade entra em produção sem testes, revisão e documentação (Artigo 7).

## 17. Requisitos não funcionais → implicações técnicas imediatas

| RNF | Implicação desde o início |
|---|---|
| Rastreabilidade/Auditoria | `AuditLog` e `TimelineEvent` embutidos no core; soft delete. |
| Idempotência/Confiabilidade | Outbox de eventos; `correlationId`; chaves idempotentes em integração. |
| Observabilidade | Logs estruturados com `requestId`/`correlationId`; métricas e tracing básicos. |
| Escalabilidade multiempresa | Escopo organizacional em todas as tabelas (ADR-0005). |
| Portabilidade | Ambientes reproduzíveis via Docker desde o dev. |
| Versionamento | APIs `/api/v1`, configurações versionadas, migrações versionadas. |

## 18. Pontos pendentes de validação que impactam o desenvolvimento

Da seção 26 da especificação, os itens que mais impactam decisões técnicas iniciais:

- **Estrutura organizacional oficial** — define o modelo de escopo (ADR-0005) e as chaves das entidades.
- **Fluxos e política de aprovação/compras** — definem as configurações do Workflow Engine e alçadas.
- **Perfis e segregação de funções** — definem a matriz RBAC (ADR-0006).
- **TOTVS RM** (versão, APIs, dados) — define contratos da camada de integração (não bloqueia o MVP 0).
- **Infraestrutura** (hospedagem, ambientes, domínio, backup) — define o pipeline e o Docker/CI.

## 19. Riscos e recomendações

| Risco | Recomendação |
|---|---|
| Construir motores configuráveis "grandes demais" cedo | Entregar versão mínima (seção 12) e evoluir por demanda. |
| Multiempresa mal definida atrasar tudo | Decidir ADR-0005 antes da primeira migração. |
| Escopo de Compras crescer antes da Fundação | Congelar a fatia vertical (seção 13) como primeiro entregável. |
| Acoplamento entre módulos | Fiscalizar dependências por eventos (ADR-0002) com lint/regras de import. |
| Integração no caminho crítico | Manter integração assíncrona/desacoplada (ADR-0001). |

## 20. Próximos passos imediatos (checklist)

1. Validar esta análise e a especificação na reunião de descoberta com a Relimpp.
2. Ratificar ADR-0002 e aprovar ADR-0004, ADR-0005 e ADR-0006 (ou registrar ajustes).
3. Confirmar a estrutura organizacional oficial e a matriz de perfis/segregação.
4. Abrir as Epics e as histórias da seção 14 no GitHub Project (MVP 0 - Foundation).
5. Executar o andaimento (seção 15) e entregar a fatia vertical (seção 13) como primeiro incremento.
6. Detalhar Database Book e API Book a partir das entidades e eventos aqui propostos.
