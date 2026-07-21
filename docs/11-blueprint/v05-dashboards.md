# V05 — Dashboards por Perfil

- Volume: 5 de 13 · Blueprint de Produto
- Status: v0.1

Princípio **dashboard first**: ao entrar, cada perfil vê prioridades, pendências e indicadores. Os cards,
KPIs e gráficos são **configuráveis** por perfil (Central No-Code — [V09](v09-central-administracao.md)) e
filtráveis por período, empresa, área, obra, centro de custo, categoria, fornecedor e status.

## 1. Estrutura geral do Dashboard

```text
┌───────────────────────────────────────────────────────────────────────┐
│ Filtros: [Período] [Empresa] [Área] [Obra] [Centro de Custo] [Status]   │
├───────────────────────────────────────────────────────────────────────┤
│ [KPI] [KPI] [KPI] [KPI]        ← cards de números                       │
├──────────────────────────────┬────────────────────────────────────────┤
│  Gráfico (evolução/compras)   │  Alertas / Ocorrências                  │
├──────────────────────────────┼────────────────────────────────────────┤
│  Meu Trabalho (resumo)        │  Agenda / próximos vencimentos          │
└──────────────────────────────┴────────────────────────────────────────┘
```

Blocos previstos (conforme visão): Solicitações Pendentes, Pedidos, Economia, Compras do Mês,
Recebimentos, Ocorrências, Fornecedores, Gráficos, Alertas, Meu Trabalho, Agenda.

## 2. Dashboards por perfil

### 2.1 Executivo / Diretoria
- KPIs: volume de compras, economia (estimada × realizada), prazo médio, compras emergenciais (%).
- Gráficos: evolução mensal, despesa por área/obra, fornecedores críticos.
- Alertas: gargalos, exceções de alçada, contratos a vencer.

### 2.2 Gestor de Área
- KPIs: solicitações da área, aprovações pendentes, orçamento consumido, atrasos.
- Listas: minhas aprovações, solicitações devolvidas, principais categorias.

### 2.3 Comprador
- KPIs: solicitações a cotar, cotações abertas, pedidos em atraso, economia obtida.
- Listas: cotações próximas do prazo, propostas recebidas, carga por comprador.

### 2.4 Solicitante
- KPIs: minhas solicitações, aprovadas, devolvidas, entregas previstas.
- Listas: status das minhas solicitações, recebimentos a confirmar.

### 2.5 Almoxarifado / Recebimento
- KPIs: entregas esperadas, atrasos, recebimentos parciais, divergências.
- Listas: pedidos aguardando entrega, ocorrências abertas.

### 2.6 Fiscal / Financeiro
- KPIs: documentos pendentes, divergências, integrações com erro.
- Listas: documentos a conferir, exceções.

### 2.7 Fornecedor (Portal)
- KPIs: convites abertos, propostas pendentes, pedidos recebidos.
- Listas: cotações a responder, pedidos em andamento, documentos a atualizar.

### 2.8 Administrador / Saúde da Plataforma
- KPIs: usuários ativos, filas, integrações, SLAs em risco, falhas.
- Listas: erros recentes, jobs, monitor de integração.

## 3. Comportamento

- Cada card é clicável e leva à lista filtrada correspondente (deep-link).
- O usuário pode reordenar/ocultar cards conforme permitido; o administrador define o padrão por perfil.
- Atualização por evento (ex.: aprovar uma solicitação atualiza os contadores).
- Exportação de painéis/relatórios quando permitido (auditável).

## 4. Telas relacionadas (ver [V10](v10-catalogo-telas.md))
- `Tela 010 — Dashboard (por perfil)`
- `Tela 011 — Meu Trabalho` (ver também [V06](v06-meu-trabalho.md))
- `Tela 050 — Indicadores / Painéis`
