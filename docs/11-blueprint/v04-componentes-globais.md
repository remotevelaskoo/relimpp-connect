# V04 — Componentes Globais (Shell)

- Volume: 4 de 13 · Blueprint de Produto
- Status: v0.1

Componentes presentes em toda a aplicação autenticada (topbar/shell).

## 1. Busca Global (🔎)

Barra de pesquisa universal, estilo Google, sempre acessível na topbar.

- **Placeholder:** "Pesquisar..." · atalho de teclado (ex.: `/` ou `Ctrl/Cmd+K`).
- **Entidades pesquisáveis:** Fornecedor, Pedido, Produto, Contrato, Solicitação, Pessoa (usuário),
  Documento, Obra, Centro de Custo (extensível por módulo).
- **Resultados:** agrupados por tipo, com ícone, título, subtítulo (contexto) e atalho para abrir.
- **Regras:** respeita **escopo e permissões** do usuário (só retorna o que ele pode ver); busca por
  nome, código, número e palavras-chave.
- **IA (futuro):** busca em linguagem natural ("solicitações da obra Centro em atraso").
- **Eventos:** registra consultas sensíveis para auditoria quando aplicável.
- Tela relacionada: `Tela 012 — Resultados de Busca` (ver [V10](v10-catalogo-telas.md)).

## 2. Centro de Notificações (🔔)

Ícone com _badge_ de contagem; abre painel lateral com as notificações do usuário.

Exemplos de itens:

```text
🔔  Você possui 4 aprovações pendentes
    Fornecedor respondeu a cotação COT-000045
    Pedido PC-000102 recebido
    Documento "Certidão FGTS" venceu
    Integração TOTVS RM falhou (reprocessar)
    Novo comentário em SC-000123
```

- **Tipos:** aprovação, resposta de fornecedor, recebimento, vencimento de documento, falha de
  integração, comentário/menção, SLA em risco.
- **Ações por item:** abrir registro, marcar como lida, silenciar tipo (quando não crítico).
- **Canais:** interna (sempre), e-mail, push (futuro), WhatsApp (quando aprovado/integrado).
- **Regras:** notificações **críticas não podem ser desativadas** pelo usuário; preferências por tipo
  em Perfil → Notificações.
- Tela relacionada: `Tela 013 — Centro de Notificações`.

## 3. Perfil do Usuário (👤)

Menu no canto superior direito → tela "Meu Perfil".

Seções:

- **Identificação:** foto, nome, cargo, departamento, empresa.
- **Permissões:** papéis e escopos atribuídos (somente leitura para o próprio usuário).
- **Delegações:** delegar aprovações a outro usuário por período (férias/afastamento).
- **Assinatura:** assinatura para documentos/decisões (quando aplicável).
- **Preferências:** tema (claro/escuro), idioma, densidade, página inicial.
- **Notificações:** preferências por tipo e canal (respeitando os críticos obrigatórios).
- **Segurança:** trocar senha, sessões ativas, MFA (futuro).

Menu rápido: Meu Perfil · Minhas Delegações · Preferências · Sair.

Tela relacionada: `Tela 014 — Meu Perfil`, `Tela 015 — Delegações`.

## 4. Topbar e identidade visual

- Logotipo/nome "RELIMPP CONNECT" à esquerda + botão de colapsar sidebar (☰).
- Busca centralizada; notificações e perfil à direita.
- Indicador de **empresa/contexto** ativo quando o usuário tem acesso a múltiplas empresas.

## 5. Acessibilidade e responsividade

- Navegação por teclado, contraste adequado, textos legíveis.
- Em telas pequenas: sidebar colapsa, busca vira ícone, ações primárias em destaque (mobile first).
