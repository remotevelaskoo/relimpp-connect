# V09 — Central de Administração

- Volume: 9 de 13 · Blueprint de Produto
- Status: v0.1

Central de configuração da plataforma, com experiência inspirada em consoles corporativos (ex.: Azure):
navegação por áreas, cada uma com seu próprio painel. **Configuração antes de customização**: quase tudo é
administrável sem alterar código-fonte, com **versionamento, publicação e auditoria**.

## 1. Áreas da Administração

```text
Administração
├── Cadastros            (entidades mestras — ver V02 §3)
├── Configurações        (parâmetros gerais)
├── Permissões           (papéis, permissões, escopos, alçadas)
├── Workflow             (fluxos, etapas, transições, alçadas)
├── Menus                (exibir/ocultar áreas por perfil)
├── Campos / Formulários (Form Builder no-code)
├── Integrações          (conexões, credenciais, filas, monitor)
├── Logs                 (auditoria, acessos, eventos técnicos)
├── Parâmetros           (valores paramétricos por módulo)
├── Templates            (Email, WhatsApp, documentos, IA)
├── APIs                 (chaves, webhooks, documentação OpenAPI)
├── Dashboards           (cards/KPIs por perfil)
└── Backups              (rotinas, retenção, restauração)
```

## 2. Central No-Code

Permite ao administrador adaptar a plataforma às regras da empresa:

| Configuração | Capacidades |
|---|---|
| **Workflow** | Etapas, responsáveis, condições, transições, aprovação paralela/sequencial, reabertura |
| **Alçadas** | Aprovadores por valor, área, categoria, obra, centro de custo ou risco |
| **Formulários** | Campos, seções, obrigatoriedade, máscaras, cálculos, regras condicionais, anexos |
| **Notificações** | Destinatários, momento, canal e conteúdo |
| **SLA** | Prazo por etapa, calendário útil, lembretes, escalonamento, tolerância |
| **Permissões** | Ações por papel e escopo |
| **Menus** | Exibir/ocultar áreas por perfil |
| **Categorias** | Tipos de compra, fornecedor, documento, ocorrência, produto, serviço |
| **Dashboards** | Cards, KPIs, listas, filtros e visões por perfil |
| **Templates** | Modelos de e-mail, convite, pedido, relatório e documentos |

## 3. Publicação e versionamento (regra crítica)

- Toda configuração tem **rascunho → versão publicada**, com autor e data.
- Alterações **não** afetam retroativamente processos já iniciados (salvo ação administrativa controlada).
- Histórico e **comparação entre versões**.
- Mudanças críticas podem exigir **aprovação de outro administrador**.

## 4. Editor de Workflow (destaque)

- Canvas de etapas e transições; por etapa: responsável (papel/escopo/alçada), condições, SLA,
  notificações, formulários e ações permitidas.
- Simulação/validação antes de publicar (o motor impede configurações inseguras/inconsistentes — ADR-0003).
- Versionar, publicar, comparar e reverter.

## 5. Integrações

- Cadastro de conexões (ex.: TOTVS RM) com **credenciais fora do código**.
- Filas, status (pendente/processando/concluído/erro/cancelado), reprocessamento, idempotência,
  mapeamento de códigos internos×externos e **monitor de integração**.
- Independência: falha externa não interrompe o fluxo interno (ADR-0001).

## 6. Logs e auditoria
- Trilha de acesso, alteração, decisão, exportação e ações administrativas (usuário, data, origem,
  contexto, `correlationId`). Comentários e decisões não editáveis sem histórico.

## 7. Telas relacionadas (ver [V10](v10-catalogo-telas.md), faixa 090–099)
- `Tela 090 — Permissões`, `091 — Alçadas`, `092 — Editor de Workflow`, `093 — Form Builder`,
  `094 — Menus`, `095 — Integrações (monitor)`, `096 — Logs`, `097 — Parâmetros`,
  `098 — Templates`, `099 — Backups`.
