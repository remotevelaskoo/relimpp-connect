# V06 — Meu Trabalho

- Volume: 6 de 13 · Blueprint de Produto
- Status: v0.1

A área **Meu Trabalho** é a principal tela operacional do usuário — tudo que exige ação em um só lugar,
com experiência inspirada em **Monday / ClickUp** (listas acionáveis, agrupamentos, filtros salvos).

## 1. Organização em abas/seções

| Seção | Conteúdo |
|---|---|
| **Hoje** | Itens com ação/vencimento para hoje |
| **Atrasados** | Itens com prazo/SLA vencido |
| **Aguardando Aprovação** | Solicitações/pedidos aguardando decisão do usuário |
| **Recebimentos** | Recebimentos aguardando confirmação do usuário |
| **Assinaturas** | Documentos/decisões aguardando assinatura |
| **Favoritos** | Registros marcados como favoritos |
| **Recentes** | Últimos registros acessados |

Complementos previstos (da Especificação, sec. 6.1): solicitações devolvidas para ajuste, cotações
próximas do prazo, pedidos aguardando entrega, documentos vencendo, tarefas delegadas/atrasadas, alertas
de SLA.

## 2. Layout

```text
┌──────────────────────────────────────────────────────────────────────┐
│  Meu Trabalho                          [ + Nova ]  [Filtro] [Ordenar]  │
│  [Hoje] [Atrasados] [Aguardando Aprovação] [Recebimentos] [Assinaturas]│
├──────────────────────────────────────────────────────────────────────┤
│  ▸ Aguardando Aprovação (4)                                            │
│     SC-000123 · Materiais obra Centro · R$ 3.575,00   [Aprovar][Abrir] │
│     SC-000124 · EPIs equipe          · R$ 500,00      [Aprovar][Abrir] │
│  ▸ Atrasados (2)                                                       │
│     COT-000045 · prazo vencido há 1 dia                 [Abrir]        │
└──────────────────────────────────────────────────────────────────────┘
```

## 3. Comportamento estilo Monday/ClickUp

- **Agrupamento** por seção, tipo, prioridade, empresa ou obra (configurável).
- **Ações rápidas inline**: aprovar, devolver, comentar, confirmar recebimento, abrir — sem sair da lista.
- **Filtros salvos** por usuário; ordenação por prazo, prioridade, valor.
- **Contadores** por seção; sincronizam com o Centro de Notificações e o Dashboard.
- **Favoritar / fixar** registros para acesso rápido.
- **Atualização por evento** (aprovar remove o item da fila e registra na timeline do processo).

## 4. Regras
- Só aparecem itens dentro do **escopo e permissões** do usuário.
- Ações respeitam **segregação de funções** (ex.: quem solicitou não aprova) — ver [V07](v07-perfis-permissoes.md).
- Toda ação registra evento na timeline do processo de origem.

## 5. Tela relacionada
- `Tela 011 — Meu Trabalho` (ver [V10](v10-catalogo-telas.md)).
