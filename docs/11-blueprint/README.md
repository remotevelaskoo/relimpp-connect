# Relimpp Connect — Blueprint de Produto

- Documento: Blueprint de Produto (visão completa antes do desenvolvimento)
- Versão: 0.1 (primeira entrega estruturada — em construção contínua)
- Data: 2026-07-21
- Base: Especificação Funcional Consolidada v1.0 (ver [Product Book](../01-product-book/README.md))
- Status: Em construção — organizado em volumes, preenchido iterativamente

> Este Blueprint é o nível de detalhe usado por produtos corporativos maduros (SAP, Microsoft Dynamics,
> Oracle NetSuite, Monday) **antes** do desenvolvimento: mapa de navegação, todos os menus e submenus,
> cada tela detalhada, perfis, permissões, fluxos completos, portal do fornecedor, central de
> administração, dashboards por perfil, integrações, APIs, modelo de dados e wireframes.
>
> Ele **estende** a Especificação Funcional Consolidada (que descreve "o quê") detalhando o "como" de cada
> tela, fluxo e componente. Nada aqui invalida a especificação; apenas aprofunda.
>
> Nota: a Especificação Funcional Consolidada versionada e as ADRs de stack/multiempresa/autenticação
> (0004–0006) são introduzidas em PRs de documentação complementares; quando integradas ao repositório,
> as referências deste Blueprint a elas podem ser transformadas em links diretos.

## Como o Blueprint está organizado (volumes)

| Volume | Conteúdo | Status |
|---|---|---|
| [V01 — Visão, módulos e escopo](v01-visao-modulos-escopo.md) | Posicionamento, princípios, módulos atuais e futuros, escopo por fase | ✅ v0.1 |
| [V02 — Menus e submenus](v02-menus-submenus.md) | Estrutura completa de navegação principal e submenus (Administração/Cadastros) | ✅ v0.1 |
| [V03 — Mapa de navegação e shell](v03-mapa-navegacao.md) | Shell da aplicação, breadcrumbs, fluxos de navegação por área | ✅ v0.1 |
| [V04 — Componentes globais](v04-componentes-globais.md) | Busca global, centro de notificações, perfil do usuário, tema/idioma | ✅ v0.1 |
| [V05 — Dashboards por perfil](v05-dashboards.md) | Dashboards Executivo, Gestor, Comprador, Solicitante, Fornecedor, etc. | ✅ v0.1 |
| [V06 — Meu Trabalho](v06-meu-trabalho.md) | Área operacional pessoal (estilo Monday/ClickUp) | ✅ v0.1 |
| [V07 — Perfis e permissões](v07-perfis-permissoes.md) | Perfis, RBAC, escopo, alçadas, segregação e delegação | ✅ v0.1 |
| [V08 — Portal do Fornecedor](v08-portal-fornecedor.md) | Fluxo completo do fornecedor (e-mail → login → cotação → proposta → pedido) | ✅ v0.1 |
| [V09 — Central de Administração](v09-central-administracao.md) | Cadastros, Configurações, Workflow, No-Code, Integrações, Logs, Templates | ✅ v0.1 |
| [V10 — Catálogo de telas](v10-catalogo-telas.md) | Template padrão + índice das ~100 telas + telas detalhadas | 🔄 v0.1 (framework + telas iniciais) |
| V11 — Modelo de dados | Ver [Database Book](../04-database/README.md) e schema Prisma | ↗ referência |
| V12 — APIs e integrações | Ver [API Book](../05-api/README.md) e ADR-0001 | ↗ referência |
| V13 — Wireframes | A produzir (ver seção Roadmap do Blueprint) | ⬜ planejado |

## Convenções

### Numeração de telas

Cada tela possui um identificador `Tela NNN` estável, agrupado por faixa de módulo (ver
[V10](v10-catalogo-telas.md)). O identificador nunca é reaproveitado; telas descontinuadas ficam marcadas
como `Deprecated`.

### Status de cada item do Blueprint

- ✅ Detalhado — pronto para virar história/protótipo.
- 🔄 Em detalhamento — estrutura definida, conteúdo parcial.
- ⬜ Planejado — previsto, ainda sem detalhamento.
- ↗ Referência — detalhado em outro volume/documento.

### Template padrão de especificação de tela

Toda tela detalhada no [V10](v10-catalogo-telas.md) segue este template:

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

### Convenção de fluxo de navegação

Todo fluxo é descrito como uma sequência de telas/ações, por exemplo:

```text
Dashboard → Compras → Solicitações → Nova Solicitação → Itens → Anexos → Enviar → Timeline
```

## Roadmap do Blueprint

O Blueprint é construído em ondas, priorizando o que já está em desenvolvimento (Compras) e a espinha
de navegação/administração:

1. **Onda 1 (esta entrega):** navegação, menus, shell, componentes globais, dashboards, Meu Trabalho,
   perfis/permissões, Portal do Fornecedor, Central de Administração e o framework do catálogo de telas.
2. **Onda 2:** detalhamento completo das telas de Compras (Solicitação, Cotação, Pedido, Recebimento,
   Fiscal) e Cadastros.
3. **Onda 3:** telas de Fornecedores, Catálogo/Produtos e Administração/No-Code.
4. **Onda 4:** módulos futuros (Contratos, Frota, Patrimônio, Obras, Financeiro, IA, Indicadores) e
   wireframes.

> Este Blueprint não substitui a validação com a Relimpp: itens marcados como "sujeito à validação"
> seguem a mesma regra da Especificação Funcional Consolidada.
