# V02 — Menus e Submenus

- Volume: 2 de 13 · Blueprint de Produto
- Status: v0.1
- Origem: estrutura proposta pelo produto (Vinicius), formalizada aqui como referência oficial.

> Esta é a **arquitetura de informação** oficial do produto. Substitui/expande a lista da seção 4.1 da
> Especificação Funcional Consolidada. A exibição de cada item respeita perfil e permissões
> (ver [V07](v07-perfis-permissoes.md)); itens de módulos futuros podem aparecer como "em breve".

## 1. Menu principal (navegação lateral)

| Ícone | Área | Rota base | Descrição |
|---|---|---|---|
| 🏠 | **Dashboard** | `/dashboard` | Painel inicial personalizado por perfil |
| 👤 | **Meu Trabalho** | `/meu-trabalho` | Pendências, aprovações e atividades do usuário |
| 📊 | **Operações** | `/operacoes` | Visão consolidada de processos ativos e gargalos |
| 📦 | **Compras** | `/compras` | Solicitações, cotações, comparações, pedidos, recebimentos |
| 📑 | **Contratos** | `/contratos` | Ciclo de vida de contratos (futuro) |
| 🚚 | **Frota** | `/frota` | Veículos, manutenções, custos (futuro) |
| 🏢 | **Patrimônio** | `/patrimonio` | Ativos e inventário (futuro) |
| 👷 | **Obras** | `/obras` | Projetos/obras e medições (futuro) |
| 💰 | **Financeiro** | `/financeiro` | Títulos, conciliação (futuro) |
| 📈 | **Indicadores** | `/indicadores` | Painéis executivos e operacionais |
| 🤖 | **IA** | `/ia` | Busca inteligente, resumos e recomendações (assistiva) |
| 📁 | **Documentos** | `/documentos` | Biblioteca corporativa e anexos |
| ⚙️ | **Administração** | `/admin` | Configuração da plataforma (ver seção 2) |

### Regras de exibição

- A ordem é fixa; a **visibilidade** de cada item depende de permissão de menu (configurável — ver
  [V09](v09-central-administracao.md)).
- Módulos futuros podem exibir _badge_ "Em breve" e abrir uma tela de _placeholder_ conforme perfil.
- O item ativo é destacado; submenus abrem em painel/segundo nível.

## 2. Administração (ao clicar em ⚙️)

| Submenu | Rota | Descrição |
|---|---|---|
| **Cadastros** | `/admin/cadastros` | Entidades mestras (ver seção 3) |
| **Configurações** | `/admin/configuracoes` | Parâmetros gerais da plataforma |
| **Permissões** | `/admin/permissoes` | Papéis, permissões, escopos e alçadas |
| **Workflow** | `/admin/workflow` | Editor de fluxos, etapas, transições e alçadas |
| **Integrações** | `/admin/integracoes` | Conexões, credenciais, filas, monitor |
| **Logs** | `/admin/logs` | Auditoria, acessos e eventos técnicos |
| **Parâmetros** | `/admin/parametros` | Valores paramétricos por módulo |
| **Central No-Code** | `/admin/no-code` | Formulários, campos, menus, dashboards, templates |

Detalhado em [V09 — Central de Administração](v09-central-administracao.md).

## 3. Cadastros (ao clicar em Administração → Cadastros)

| Cadastro | Rota | Observação |
|---|---|---|
| **Empresas** | `/admin/cadastros/empresas` | Tenant raiz |
| **Filiais** | `/admin/cadastros/filiais` | Vinculada a empresa |
| **Departamentos** | `/admin/cadastros/departamentos` | Vinculado a empresa |
| **Centros de Custo** | `/admin/cadastros/centros-de-custo` | Vinculado a empresa |
| **Obras** | `/admin/cadastros/obras` | Vinculada a empresa |
| **Usuários** | `/admin/cadastros/usuarios` | Vínculo organizacional + papéis |
| **Perfis** | `/admin/cadastros/perfis` | Papéis e conjuntos de permissão |
| **Clientes** | `/admin/cadastros/clientes` | Base de clientes |
| **Fornecedores** | `/admin/cadastros/fornecedores` | Cadastro + homologação — ✅ implementado, ver [Tela 067/068](v10-catalogo-telas.md) |
| **Produtos** | `/admin/cadastros/produtos` | Catálogo de produtos |
| **Serviços** | `/admin/cadastros/servicos` | Catálogo de serviços |
| **Categorias** | `/admin/cadastros/categorias` | Tipos de compra/fornecedor/documento/etc. |
| **Marcas** | `/admin/cadastros/marcas` | Marcas de produtos |
| **Unidades** | `/admin/cadastros/unidades` | Unidades de medida |
| **Transportadoras** | `/admin/cadastros/transportadoras` | Logística |
| **Moedas** | `/admin/cadastros/moedas` | Moedas e câmbio |
| **Impostos** | `/admin/cadastros/impostos` | Tributos e alíquotas |
| **Tipos de Documento** | `/admin/cadastros/tipos-documento` | Classificação de documentos |

> **Nota de implementação:** 6 dos 18 cadastros já estão implementados e nesteados sob Administração →
> Cadastros na sidebar: os 5 de estrutura organizacional (Empresas, Filiais, Departamentos, Centros de
> Custo, Obras) e Fornecedores (cadastro + homologação). A única diferença de rota é o prefixo: o frontend
> usa `/dashboard` como segmento de shell autenticado (o mesmo padrão de `/dashboard/compras/...` e
> `/dashboard/meu-trabalho`), então as rotas reais são `/dashboard/admin/cadastros/<entidade>` em vez de
> `/admin/cadastros/<entidade>`. Os demais 12 cadastros desta tabela ainda não têm tela — ver
> [V10](v10-catalogo-telas.md) faixa 080–089.

## 4. Padrão visual do menu

- Sidebar fixa à esquerda (colapsável para ícones em telas menores — mobile first).
- Agrupamento por seções quando aplicável; realce do item ativo.
- Topbar global com **busca**, **notificações** e **perfil** (ver [V04](v04-componentes-globais.md)).
- Breadcrumbs abaixo da topbar refletindo o caminho (ver [V03](v03-mapa-navegacao.md)).
