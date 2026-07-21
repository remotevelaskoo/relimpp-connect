# V01 — Visão, Módulos e Escopo

- Volume: 1 de 13 · Blueprint de Produto
- Status: v0.1

## 1. Posicionamento (síntese)

O Relimpp Connect é uma **plataforma corporativa modular, configurável e independente de ERP**, que conecta
pessoas, processos, documentos, indicadores e sistemas em **uma única experiência**. Detalhes de visão,
missão e princípios estão na Especificação Funcional Consolidada (ver [Product Book](../01-product-book/README.md),
seções 1 a 3) e não são repetidos aqui; este volume foca na **estrutura de módulos** e no **escopo** que
orientam o restante do Blueprint.

## 2. Camadas do produto

```text
┌───────────────────────────────────────────────────────────────────────┐
│  EXPERIÊNCIA ÚNICA (Shell: topbar, busca global, notificações, perfil)  │
│  Dashboard por perfil · Meu Trabalho · Operações                        │
├───────────────────────────────────────────────────────────────────────┤
│  MÓDULOS DE NEGÓCIO                                                      │
│  Compras · Contratos · Frota · Patrimônio · Obras · Financeiro · …      │
├───────────────────────────────────────────────────────────────────────┤
│  CORE PLATFORM                                                          │
│  Organização · Usuários/Perfis · Workflow · Formulários · Documentos ·  │
│  Timeline · Notificações · SLA · Dashboards · Eventos · Auditoria       │
├───────────────────────────────────────────────────────────────────────┤
│  INTEGRAÇÃO (opcional, desacoplada): TOTVS RM, APIs, Excel/CSV, filas   │
└───────────────────────────────────────────────────────────────────────┘
```

## 3. Mapa de módulos (atuais e futuros)

O menu principal antecipa módulos que serão construídos ao longo do tempo, todos sobre o mesmo Core.

| Módulo | Situação | Escopo resumido |
|---|---|---|
| **Compras** | Em desenvolvimento (MVP) | Solicitação, aprovação, cotação, comparação, pedido, recebimento, fiscal |
| **Contratos** | Futuro | Ciclo de vida de contratos, vigências, aditivos, alertas |
| **Frota** | Futuro | Veículos, manutenções, abastecimento, custos |
| **Patrimônio** | Futuro | Ativos, localização, depreciação, inventário |
| **Obras** | Futuro | Projetos/obras, medições, diários, custos |
| **Financeiro** | Futuro | Títulos, centros de custo, conciliação, integração |
| **Indicadores** | Transversal | Painéis executivos e operacionais |
| **IA** | Transversal | Busca, resumo, recomendações, detecção de anomalias (assistiva) |
| **Documentos** | Transversal (Core) | Biblioteca corporativa e anexos vinculados |
| **Administração** | Transversal (Core) | Cadastros, configuração no-code, permissões, integrações, logs |

> Os módulos futuros entram no menu como áreas navegáveis desde cedo (podendo exibir estado "em breve"
> conforme perfil), reforçando a visão de plataforma única. A ordem/priorização segue o roadmap e é
> **sujeita à validação**.

## 4. Escopo por fase (alinhado ao roadmap)

| Fase | Foco | Telas-chave (ver [V10](v10-catalogo-telas.md)) |
|---|---|---|
| Fundação | Auth, organização, perfis, Core | Login, Dashboard, Meu Trabalho, Cadastros |
| Compras MVP | Solicitação → aprovação → cotação → pedido | Solicitações, Nova Solicitação, Cotações, Pedidos |
| Portal do Fornecedor | Convite, proposta, mensagens | Portal (login, cotações, proposta) |
| Recebimento | Entrega, divergência, confirmação | Recebimentos |
| Fiscal | Documentos fiscais, conferência | Fiscal |
| Integrações | TOTVS RM e outros | Monitor de integração |
| Expansão | IA, novos módulos, dashboards avançados | Módulos futuros |

## 5. Princípios que guiam o Blueprint

- **Dashboard first / Workflow first:** todo perfil entra numa visão de prioridades; tudo relevante passa
  por fluxo rastreável.
- **Configuração antes de customização:** menus, formulários, workflows, alçadas, SLAs e permissões são
  administráveis pela Central No-Code (ver [V09](v09-central-administracao.md)).
- **Timeline em todo processo:** cada registro relevante tem histórico cronológico (ver [V03](v03-mapa-navegacao.md)).
- **Mobile first e acessibilidade:** todas as telas operacionais funcionam em celular.
- **Segurança e auditoria** por padrão (ver [V07](v07-perfis-permissoes.md)).
