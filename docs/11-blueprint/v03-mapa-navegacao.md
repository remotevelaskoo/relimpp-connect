# V03 — Mapa de Navegação e Shell da Aplicação

- Volume: 3 de 13 · Blueprint de Produto
- Status: v0.1

## 1. Shell da aplicação

Toda tela autenticada vive dentro de um **shell** comum:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  TOPBAR:  ☰  RELIMPP CONNECT     [ 🔎 Pesquisar... ]        🔔  👤 Usuário  │
├───────────┬──────────────────────────────────────────────────────────────┤
│           │  Breadcrumb: Compras › Solicitações › SC-000123                │
│  SIDEBAR  ├──────────────────────────────────────────────────────────────┤
│  (menu)   │                                                                │
│  🏠 Dash  │   CONTEÚDO DA TELA                                             │
│  👤 Meu.. │                                                                │
│  📦 Comp. │                                                                │
│  …        │                                                                │
│  ⚙️ Admin │                                                                │
└───────────┴──────────────────────────────────────────────────────────────┘
```

Componentes do shell (detalhados em [V04](v04-componentes-globais.md)):

- **Busca global** (🔎) — pesquisa multi-entidade estilo Google.
- **Centro de notificações** (🔔) — pendências e eventos.
- **Perfil do usuário** (👤) — conta, preferências, delegações, sair.
- **Sidebar** — menu principal ([V02](v02-menus-submenus.md)), colapsável (mobile first).
- **Breadcrumb** — caminho hierárquico da tela atual, clicável.

## 2. Princípios de navegação

- **Máximo 3 cliques** para chegar a qualquer ação frequente a partir do Dashboard/Meu Trabalho.
- **Breadcrumb sempre presente** em telas internas; cada nível é navegável.
- **Contexto preservado**: filtros e empresa selecionada persistem por sessão.
- **Ações rápidas** disponíveis em listas (aprovar, comentar, abrir) sem entrar na tela de detalhe.
- **Deep-linking**: toda tela de detalhe tem URL estável (ex.: `/compras/solicitacoes/:id`).

## 3. Fluxos de navegação por área

Cada tela do produto pertence a pelo menos um fluxo. Notação: `→` avança, `⇄` ida e volta.

### 3.1 Compras — Solicitação

```text
Dashboard → Compras → Solicitações → Nova Solicitação
  → (preenche cabeçalho) → Itens → Anexos → Revisar → Enviar
  → Solicitação (detalhe) ⇄ Workflow ⇄ Timeline ⇄ Comentários ⇄ Histórico
```

### 3.2 Compras — Aprovação (gestor)

```text
Meu Trabalho → Aguardando Aprovação → Solicitação (detalhe)
  → [Aprovar] | [Devolver + justificativa] | [Rejeitar + justificativa]
  → Timeline atualizada → Notificação ao solicitante
```

### 3.3 Compras — Cotação e seleção (comprador)

```text
Compras → Cotações → Nova Rodada → (seleciona solicitações aprovadas)
  → (agrupa itens) → (convida fornecedores) → Enviar convites
  → Mapa Comparativo (atualiza com propostas) → Selecionar fornecedor(es)
  → (justificativa se não for menor custo) → Gerar Pedido
```

### 3.4 Pedido → Recebimento → Fiscal

```text
Compras → Pedidos → Pedido (detalhe) → Enviar ao fornecedor → Aceite
  → Recebimento → (conferência, evidências, divergências) → Confirmação do solicitante
  → Fiscal → (vincula documento, confere) → Concluído
```

### 3.5 Portal do Fornecedor (resumo — detalhe em [V08](v08-portal-fornecedor.md))

```text
E-mail (convite) → Link → Login do Portal → Dashboard do Fornecedor
  → Cotação → Responder → Salvar → Enviar Proposta
  → (cliente notificado, mapa comparativo atualiza)
```

### 3.6 Administração

```text
Administração → (Cadastros | Configurações | Permissões | Workflow |
  Integrações | Logs | Parâmetros | Central No-Code) → tela específica
```

## 4. Fluxo interno padrão de uma tela de processo

Toda tela de **registro de processo** (solicitação, cotação, pedido, recebimento, fornecedor, etc.)
oferece as mesmas "abas"/seções internas:

```text
<Registro> → Dados → Itens → Anexos → Workflow → Timeline → Comentários → Histórico
```

- **Dados**: cabeçalho e campos do formulário.
- **Itens**: linhas do registro (quando aplicável).
- **Anexos**: documentos vinculados (Document Service — ver [Product Book](../01-product-book/README.md)).
- **Workflow**: etapa atual, responsáveis, ações disponíveis.
- **Timeline**: histórico cronológico de eventos.
- **Comentários**: comunicação registrada.
- **Histórico**: versões e alterações de dados críticos (auditoria).

## 5. Estados de navegação e vazios

- **Carregando**: _skeletons_ nas listas/cards.
- **Vazio**: mensagem orientativa + ação primária (ex.: "Nenhuma solicitação. Criar a primeira").
- **Erro**: mensagem clara + como corrigir/retentar.
- **Sem permissão**: tela/ação oculta ou bloqueada com aviso de escopo.
