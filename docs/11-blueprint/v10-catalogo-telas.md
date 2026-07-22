# V10 — Catálogo de Telas

- Volume: 10 de 13 · Blueprint de Produto
- Status: 🔄 v0.1 (framework + índice completo + telas iniciais detalhadas)

Este volume enumera **todas as telas** da plataforma (~100+), com identificador estável, e detalha cada
uma no template padrão. Nesta primeira onda, o **índice completo** está definido e um conjunto inicial de
telas está **detalhado**; as demais seguem como `⬜ Planejado`, a serem preenchidas por onda (ver
[README](README.md#roadmap-do-blueprint)).

## 1. Template padrão

```text
Tela NNN — <Nome>
- Módulo:
- Rota:
- Objetivo:
- Perfis / permissões:
- Pré-condições:
- Layout e componentes:
- Campos:
- Ações / botões:
- Estados (vazio, carregando, erro, sucesso):
- Validações:
- Eventos disparados:
- Navegação (origem → esta tela → destinos):
- Dados / API:
- Regras de negócio:
- Auditoria / timeline:
- Observações / pendências de validação:
```

## 2. Índice das telas (por faixa de módulo)

### 000–009 · Autenticação e Conta
| Tela | Nome | Status |
|---|---|---|
| 001 | Login | ✅ |
| 002 | Recuperação de senha | ⬜ |
| 003 | Definir/alterar senha | ⬜ |
| 004 | 1º acesso / ativação | ⬜ |
| 005 | Bloqueio / sessão expirada | ⬜ |

### 010–019 · Shell e Globais
| Tela | Nome | Status |
|---|---|---|
| 010 | Dashboard (por perfil) | ✅ |
| 011 | Meu Trabalho | ✅ |
| 012 | Resultados de Busca Global | ✅ |
| 013 | Centro de Notificações | ✅ |
| 014 | Meu Perfil | ⬜ |
| 015 | Delegações | ⬜ |

### 020–029 · Operações
| Tela | Nome | Status |
|---|---|---|
| 020 | Operações (visão consolidada) | ⬜ |
| 021 | Processo (detalhe genérico) | ⬜ |

### 030–039 · Compras
| Tela | Nome | Status |
|---|---|---|
| 030 | Solicitações (lista) | ✅ |
| 031 | Nova Solicitação | ✅ |
| 032 | Solicitação (detalhe) | ✅ |
| 033 | Cotações (lista) | ⬜ |
| 034 | Nova Rodada de Cotação | ⬜ |
| 035 | Cotação (detalhe) + convites | ⬜ |
| 036 | Mapa Comparativo | ⬜ |
| 037 | Pedidos (lista) | ⬜ |
| 038 | Pedido (detalhe) | ⬜ |

### 040–049 · Recebimento e Fiscal
| Tela | Nome | Status |
|---|---|---|
| 040 | Recebimentos (lista) | ⬜ |
| 041 | Recebimento (registro/conferência) | ⬜ |
| 042 | Confirmação do solicitante | ⬜ |
| 043 | Documentos Fiscais (lista) | ⬜ |
| 044 | Documento Fiscal (conferência) | ⬜ |

### 050–059 · Indicadores e Documentos
| Tela | Nome | Status |
|---|---|---|
| 050 | Indicadores / Painéis | ⬜ |
| 051 | Relatórios | ⬜ |
| 052 | Documentos (biblioteca) | ⬜ |
| 053 | Documento (detalhe/versões) | ⬜ |

### 060–069 · Fornecedores e Portal
| Tela | Nome | Status |
|---|---|---|
| 060 | Portal — Login / 1º acesso | ⬜ |
| 061 | Portal — Dashboard do Fornecedor | ⬜ |
| 062 | Portal — Cotação (visualização) | ⬜ |
| 063 | Portal — Responder Proposta | ✅ |
| 064 | Portal — Mensagens da Cotação | ⬜ |
| 065 | Portal — Meus Pedidos | ⬜ |
| 066 | Portal — Meus Documentos | ⬜ |
| 067 | Fornecedores (lista, interno) | ✅ |
| 068 | Fornecedor (detalhe, interno) | ✅ |
| 069 | Homologação de Fornecedor | ↗ (ações dentro da Tela 068) |

### 070–079 · Catálogo
| Tela | Nome | Status |
|---|---|---|
| 070 | Produto (detalhe) | ✅ |
| 071 | Produtos (lista) | ⬜ |
| 072 | Serviços (lista) | ⬜ |
| 073 | Serviço (detalhe) | ⬜ |
| 074 | Kits / listas recorrentes | ⬜ |

### 080–089 · Cadastros
| Tela | Nome | Status |
|---|---|---|
| 080 | Empresas | ✅ (implementado) |
| 081 | Filiais | ✅ (implementado) |
| 082 | Departamentos | ✅ (implementado) |
| 083 | Centros de Custo | ✅ (implementado) |
| 084 | Obras | ✅ (implementado) |
| 085 | Usuários | ✅ |
| 086 | Perfis | ✅ |
| 087 | Clientes | ⬜ |
| 088 | Categorias / Marcas / Unidades | ⬜ |
| 089 | Transportadoras / Moedas / Impostos / Tipos de Documento | ⬜ |

### 090–099 · Administração
| Tela | Nome | Status |
|---|---|---|
| 090 | Permissões | ⬜ |
| 091 | Alçadas | ⬜ |
| 092 | Editor de Workflow | ⬜ |
| 093 | Form Builder | ⬜ |
| 094 | Menus | ⬜ |
| 095 | Integrações (monitor) | ⬜ |
| 096 | Logs / Auditoria | ⬜ |
| 097 | Parâmetros | ⬜ |
| 098 | Templates (Email/WhatsApp/IA) | ⬜ |
| 099 | Backups | ⬜ |

### 100+ · Módulos futuros
| Faixa | Módulo |
|---|---|
| 100–109 | Contratos |
| 110–119 | Frota |
| 120–129 | Patrimônio |
| 130–139 | Obras (gestão) |
| 140–149 | Financeiro |
| 150–159 | IA (assistente) |

---

## 3. Telas detalhadas (onda 1)

### Tela 001 — Login
- **Módulo:** Autenticação · **Rota:** `/login`
- **Objetivo:** autenticar o usuário na plataforma.
- **Perfis/permissões:** público (não autenticado).
- **Pré-condições:** usuário cadastrado e ativo.
- **Layout:** cartão central com logotipo, campos e ação; link "Esqueci minha senha".
- **Campos:** e-mail, senha.
- **Ações:** Entrar; Recuperar senha (→ Tela 002).
- **Estados:** carregando (botão "Entrando…"), erro ("Credenciais inválidas"), sucesso (→ Dashboard).
- **Validações:** e-mail válido; senha mínima; bloqueio após N tentativas.
- **Eventos:** `UserLoggedIn`, `LoginFailed`.
- **Navegação:** Login → Dashboard (Tela 010).
- **Dados/API:** `POST /auth/login` → JWT.
- **Regras:** sessão segura, expiração; MFA futuro.
- **Auditoria:** registra login e falhas.
- **Status:** ✅ implementado no MVP.

### Tela 010 — Dashboard (por perfil)
- **Módulo:** Shell · **Rota:** `/dashboard`
- **Objetivo:** visão inicial de prioridades/indicadores conforme o perfil.
- **Perfis:** todos autenticados (conteúdo varia por perfil — ver [V05](v05-dashboards.md)).
- **Layout:** filtros no topo, faixa de KPIs, gráficos, alertas, resumo de Meu Trabalho, agenda.
- **Ações:** aplicar filtros; clicar em card → lista filtrada; reordenar/ocultar cards (se permitido).
- **Estados:** carregando (skeletons), vazio (orientação), erro.
- **Eventos:** consome eventos de domínio para atualizar contadores.
- **Navegação:** Dashboard → (qualquer área via card).
- **Dados/API:** endpoints de indicadores por perfil (a definir).
- **Regras:** respeita escopo/permissões; padrão por perfil definido na Administração.
- **Status:** 🔄 implementado como placeholder no MVP; detalhar por perfil.

### Tela 011 — Meu Trabalho
Ver detalhamento em [V06](v06-meu-trabalho.md). Rota `/meu-trabalho`. Seções: Hoje, Atrasados, Aguardando
Aprovação, Recebimentos, Assinaturas, Favoritos, Recentes. Ações rápidas inline (aprovar/devolver/abrir).

### Tela 012 — Resultados de Busca Global
- **Rota:** `/busca?q=` · **Objetivo:** exibir resultados multi-entidade.
- **Layout:** resultados agrupados por tipo (Fornecedor, Pedido, Produto, Solicitação, Pessoa, Documento,
  Obra, Centro de Custo), com atalho para abrir.
- **Regras:** respeita escopo/permissões; consultas sensíveis auditadas. Ver [V04](v04-componentes-globais.md).

### Tela 030 — Solicitações (lista)
- **Módulo:** Compras · **Rota:** `/compras/solicitacoes`
- **Objetivo:** listar e filtrar solicitações de compra; iniciar nova.
- **Perfis:** Solicitante (as suas), Gestor/Comprador (escopo), Admin.
- **Layout:** seletor de empresa, filtros (status/prioridade/período), tabela (número, justificativa,
  prioridade, itens, status), botão "Nova Solicitação".
- **Ações:** abrir (→ 032), nova (→ 031); ações rápidas de aprovação quando aplicável.
- **Estados:** vazio ("Nenhuma solicitação"), carregando, erro.
- **Eventos:** —
- **Navegação:** Dashboard/Compras → Solicitações → 031/032.
- **Dados/API:** `GET /purchase-requests?companyId=`.
- **Status:** ✅ implementado no MVP.

### Tela 031 — Nova Solicitação
- **Módulo:** Compras · **Rota:** `/compras/solicitacoes/nova`
- **Objetivo:** criar solicitação (rascunho) com itens.
- **Campos (Especificação sec. 8.1):** empresa, **filial, departamento, obra, centro de custo** (seletores
  opcionais, populados por `/branches`, `/departments`, `/projects`, `/cost-centers` filtrados pela
  empresa), **tipo/categoria** (`/categories?type=purchase`), justificativa, prioridade, **criticidade**,
  **confidencial** (checkbox), **itens** (descrição, especificação, quantidade, unidade, preço estimado,
  **data necessária**, **local de entrega** — estes dois últimos por item, não por solicitação). **Anexos**
  ainda não existem (sem sistema de upload/armazenamento no projeto).
- **Ações:** adicionar/remover item; salvar rascunho; salvar e enviar.
- **Validações:** campos obrigatórios; ao menos 1 item; filial/departamento/obra/centro de custo, quando
  informados, precisam pertencer à empresa selecionada (`400` da API se não pertencerem).
- **Eventos:** `PurchaseRequestCreated`.
- **Navegação:** → Solicitação (032).
- **Dados/API:** `POST /purchase-requests`, `GET /categories?type=purchase`, `GET /branches|departments|projects|cost-centers?companyId=`.
- **Regras:** rascunho editável; itens do catálogo autopreenchem descrição/unidade/especificação
  (futuro); duplicação de solicitações preservando rastreabilidade.
- **Status:** ✅ implementado no MVP — cobre todos os campos da seção 8.1 exceto anexos.

### Tela 032 — Solicitação (detalhe)
- **Módulo:** Compras · **Rota:** `/compras/solicitacoes/:id`
- **Objetivo:** visualizar e conduzir a solicitação pelo workflow.
- **Layout (abas):** Dados · Itens · Anexos · Workflow · Timeline · Comentários · Histórico.
- **Ações por status:** enviar, aprovar, devolver (+justificativa), rejeitar (+justificativa), cancelar
  (+motivo), editar (rascunho/devolvida).
- **Estados/Status:** Rascunho, Em aprovação, Devolvida, Aprovada, Rejeitada, Cancelada (Apêndice A).
- **Eventos:** `PurchaseRequestSubmitted`, `ApprovalCompleted`, etc.
- **Navegação:** ⇄ Workflow ⇄ Timeline; → Cotação (quando aprovada).
- **Dados/API:** `GET /purchase-requests/:id`, `POST .../submit|approve|reject|return|cancel`.
- **Regras:** rejeição/devolução/cancelamento exigem justificativa; resumo de impacto financeiro. Cada ação
  agora exige permissão do papel do usuário (ver [API Book §5.3](../05-api/README.md#53-como-o-rbac-é-aplicado-permissionsguard)) —
  **pendência de UX:** o frontend ainda mostra os botões pra qualquer usuário e só descobre que falta
  permissão quando a API responde `403` (mensagem exibida no card de erro da tela); ainda não esconde
  ações que o usuário não pode executar.
- **Auditoria:** cada transição gera evento na timeline.
- **Status:** ✅ implementado no MVP (fluxo sequencial).

### Tela 063 — Portal — Responder Proposta
- **Módulo:** Portal do Fornecedor · **Rota:** `/portal/cotacoes/:id/responder`
- **Objetivo:** o fornecedor registra e envia sua proposta.
- **Perfis:** Fornecedor (apenas suas cotações).
- **Campos:** por item (preço unitário, quantidade atendida, disponibilidade, prazo, observação); gerais
  (pagamento, prazo, frete, impostos, validade, anexos).
- **Ações:** salvar rascunho; enviar proposta.
- **Validações:** dentro do prazo; preços válidos; ao menos um item respondido.
- **Eventos:** `PropostaEnviada` → notifica comprador; atualiza mapa comparativo.
- **Navegação:** Portal Dashboard → Cotação (062) → Responder (063).
- **Regras:** após envio, alterações geram nova versão e notificam; bloqueio após encerramento.
- **Status:** ⬜ a implementar. Ver [V08](v08-portal-fornecedor.md).

### Tela 067 — Fornecedores (lista, interno)
- **Módulo:** Fornecedores · **Rota:** `/dashboard/admin/cadastros/fornecedores`
- **Objetivo:** listar fornecedores da empresa selecionada e pré-cadastrar um novo.
- **Perfis/permissões:** qualquer usuário autenticado (RBAC granular ainda não aplicado — ver
  [Database Book §6.4](../04-database/README.md#6-divergências-conhecidas-entre-o-blueprintespecificação-e-o-schema-atual)).
- **Layout:** seletor de empresa + formulário de pré-cadastro (razão social, nome fantasia, CNPJ, e-mail,
  telefone) + tabela (razão social, CNPJ, e-mail, status).
- **Ações:** pré-cadastrar (→ status `PRE_REGISTERED`); abrir (→ Tela 068).
- **Estados:** vazio ("Nenhum fornecedor cadastrado ainda"), carregando, erro.
- **Navegação:** Administração › Cadastros › Fornecedores → Tela 068.
- **Dados/API:** `GET /suppliers?companyId=`, `POST /suppliers` — ver [API Book §4](../05-api/README.md#4-fornecedores-suppliers).
- **Status:** ✅ implementado no MVP.

### Tela 068 — Fornecedor (detalhe, interno)
- **Módulo:** Fornecedores · **Rota:** `/dashboard/admin/cadastros/fornecedores/:id`
- **Objetivo:** visualizar, editar e conduzir a homologação do fornecedor.
- **Layout implementado:** cabeçalho com nome + badge de status, botões de ação conforme o status atual,
  bloco de dados (ou formulário de edição) e **Timeline**. As demais abas da visão 360º pretendida
  (Documentos, Histórico, Avaliações, Pedidos, Cotações, Financeiro, Contratos, Ocorrências, Dashboard)
  **ainda não existem** — dependem de módulos que não foram implementados (Documentos, Cotação, Pedido,
  Avaliação de fornecedor).
- **Campos (Dados):** razão social, nome fantasia, CNPJ, e-mail, telefone. Endereços, categorias e dados
  bancários **não estão no schema atual** (ver [Database Book](../04-database/README.md)).
- **Status do fornecedor:** Pré-cadastro, Em análise, Homologado, Homologado com restrição, Suspenso,
  Bloqueado, Inativo (`PRE_REGISTERED · UNDER_REVIEW · APPROVED · RESTRICTED · SUSPENDED · BLOCKED · INACTIVE`).
- **Ações (por status):** enviar para análise (`PRE_REGISTERED → UNDER_REVIEW`), homologar / homologar com
  restrição (`UNDER_REVIEW → APPROVED/RESTRICTED`), suspender (`APPROVED/RESTRICTED → SUSPENDED`, motivo
  obrigatório), bloquear (motivo obrigatório), reativar (`SUSPENDED/BLOCKED → APPROVED`), inativar (motivo
  obrigatório), editar dados (bloqueado apenas quando `BLOCKED`), excluir (só em `PRE_REGISTERED`).
- **Homologação (Tela 069):** não é uma tela separada — as ações de homologar/restringir/suspender/
  bloquear/reativar/inativar estão nesta própria tela, cada uma com evento próprio na timeline.
- **Eventos:** `CREATED`, `SUBMITTED_FOR_REVIEW`, `APPROVED`, `APPROVED_WITH_RESTRICTION`, `SUSPENDED`,
  `BLOCKED`, `REACTIVATED`, `INACTIVATED`.
- **Regras:** cada transição é validada contra o status atual (`400` se a ação não for permitida — mesmo
  padrão da Solicitação de Compra); motivo obrigatório (mín. 3 caracteres) em suspender/bloquear/inativar.
  Cada ação de homologação agora exige permissão (`supplier:*`, ver
  [API Book §5.3](../05-api/README.md#53-como-o-rbac-é-aplicado-permissionsguard)) — mesma pendência de UX
  da Tela 032 (frontend não esconde botões sem permissão, só mostra o erro `403` da API).
- **Auditoria/timeline:** toda mudança de status vira um `SupplierEvent`, exibido cronologicamente.
- **Pendências:** documentos com validade/alerta de vencimento, risco calculado e categorias de
  fornecimento (previstos na Especificação, seção 10) ainda não implementados.
- **Dados/API:** `GET/PATCH/DELETE /suppliers/:id`, `POST /suppliers/:id/{submit-for-review,approve,
  suspend,block,reactivate,inactivate}` — ver [API Book §4](../05-api/README.md#4-fornecedores-suppliers).
- **Status:** ✅ implementado no MVP (homologação básica; visão 360º completa é trabalho futuro).

### Tela 085 — Usuários (lista + cadastro)
- **Módulo:** Cadastros · **Rota:** `/dashboard/admin/cadastros/usuarios`
- **Objetivo:** listar usuários, criar conta de acesso e ver os papéis atribuídos a cada um.
- **Perfis/permissões:** qualquer usuário autenticado (RBAC granular ainda não aplicado — mesma pendência
  registrada na Tela 067).
- **Layout:** formulário de criação (nome, e-mail, senha, empresa opcional) + tabela com nome, e-mail,
  papéis atribuídos (resumo "Papel · Empresa") e status.
- **Ações:** criar; abrir (→ Tela 086 não, → detalhe do próprio usuário, ver abaixo).
- **Dados/API:** `GET/POST /users` — ver [API Book §5](../05-api/README.md#5-usuários-papéis-e-permissões-users-roles-permissions).
- **Status:** ✅ implementado no MVP.

### Tela 085b — Usuário (detalhe)
- **Rota:** `/dashboard/admin/cadastros/usuarios/:id`
- **Layout:** dados (nome/e-mail/empresa/ativo), redefinir senha, e gestão de "Papéis atribuídos" — lista
  de vínculos papel+escopo com botão remover, e formulário para atribuir um novo (papel + empresa opcional;
  sem empresa = papel global, válido em todas as empresas).
- **Ações:** salvar dados, redefinir senha, atribuir papel, remover papel.
- **Regras:** um usuário pode ter várias linhas de papel (uma por combinação papel×empresa), implementando
  o modelo "papel + escopo" do V07.
- **Dados/API:** `PATCH /users/:id`, `POST /users/:id/set-password`, `POST/DELETE /users/:id/role-scopes[/:id]`.
- **Status:** ✅ implementado no MVP.

### Tela 086 — Perfis (lista + cadastro)
- **Módulo:** Cadastros · **Rota:** `/dashboard/admin/cadastros/perfis`
- **Objetivo:** listar papéis (perfis) existentes e criar novos.
- **Layout:** formulário de criação (key snake_case, nome, descrição) + tabela com nome, key e contagem de
  permissões.
- **Dados/API:** `GET/POST /roles` — ver [API Book §5](../05-api/README.md#5-usuários-papéis-e-permissões-users-roles-permissions).
- **Status:** ✅ implementado no MVP.

### Tela 086b — Perfil (detalhe)
- **Rota:** `/dashboard/admin/cadastros/perfis/:id`
- **Layout:** dados (nome/descrição) + checklist de permissões agrupado por recurso (ex. `company`,
  `user`), com um botão "Salvar permissões" que substitui o conjunto completo de uma vez.
- **Regras:** `PATCH /roles/:id/permissions` recebe a lista completa de `permissionIds` e substitui tudo —
  não há endpoint de adicionar/remover uma permissão isolada.
- **Pendências:** não há tela para criar novas `Permission` (ações/recursos) — hoje são só as 5 seedadas;
  criar permissão exigiria uma tela própria ou expandir o seed conforme novos módulos chegam.
- **Dados/API:** `GET /permissions`, `PATCH /roles/:id`, `PATCH /roles/:id/permissions`.
- **Status:** ✅ implementado no MVP.

### Tela 070 — Produto (detalhe)
- **Módulo:** Catálogo · **Rota:** `/admin/cadastros/produtos/:id`
- **Objetivo:** visão completa do item de catálogo.
- **Layout (abas):** Fotos · Especificação · Fornecedor(es) · Preço · Histórico · Pedidos · Consumo ·
  Estoque · Documentos · Timeline.
- **Campos:** código interno, nome, descrição, categoria, unidade, marca, modelo, material, status;
  equivalentes/kits/substitutos; fornecedores preferenciais (prazo/preço/condição/validade).
- **Regras:** histórico de preço por fornecedor/período; aviso de item inativo/substituído/não homologado.
- **Status:** ⬜ a implementar.

---

## 4. Como evoluir este catálogo
Cada tela `⬜ Planejado` deve ser promovida a `✅` preenchendo o template completo (seção 1), preferencialmente
acompanhada de wireframe (V13). A ordem segue as ondas do [roadmap do Blueprint](README.md#roadmap-do-blueprint).
