# Changelog

Todas as alterações relevantes do produto serão registradas neste arquivo.

O formato seguirá os princípios de **Keep a Changelog** e versionamento semântico quando o produto iniciar suas versões publicáveis.

## [Não lançado]

### Corrigido

- Autenticação: `JwtModule` lia `process.env.JWT_SECRET` na ordem de import (antes do `ConfigModule` carregar o `.env`), assinando tokens com o segredo padrão `dev-secret` enquanto a validação (`JwtStrategy`) usava o valor real do `.env` — qualquer `JWT_SECRET` customizado quebrava login e todas as rotas autenticadas (`401` em `/auth/me` e demais). Corrigido com `JwtModule.registerAsync` + `ConfigService` em ambos os pontos.

### Adicionado

- Gestão de Usuários e Perfis: CRUD de usuários (com redefinição de senha e vínculo de empresa), atribuição de papel+escopo (`/users/:id/role-scopes`), CRUD de papéis e edição do conjunto de permissões de cada papel. Backend (`/users`, `/roles`, `/permissions`) e frontend (Administração → Cadastros → Usuários/Perfis).
- `infrastructure/local-db-windows/`: PostgreSQL local persistente para Windows sem Docker e sem privilégios de administrador (binários oficiais do Postgres 16 via `embedded-postgres`, mesmas credenciais do `docker-compose.dev.yml`).
- Estrutura inicial de governança e documentação.
- Templates de Issues e Pull Requests.
- ADRs iniciais da plataforma.
- Especificação Funcional Consolidada versionada em `docs/01-product-book`.
- Análise técnica de início de desenvolvimento em `docs/01-product-book`.
- ADR-0004 (stack tecnológico), ADR-0005 (estratégia multiempresa) e ADR-0006 (autenticação e autorização), propostas.
- Blueprint de Produto (V01–V10) em `docs/11-blueprint`: navegação, menus, componentes globais, dashboards, Meu Trabalho, perfis/permissões, Portal do Fornecedor, Central de Administração e catálogo de telas.
- Scaffolding executável do MVP 0 (Fundação): backend NestJS + Prisma (auth JWT, empresas, health) e frontend Next.js (login, "Meu Trabalho", empresas).
- Edição de empresas e padronização de CNPJ (máscara `xx.xxx.xxx/xxxx-xx`, validação estrutural de 14 dígitos e CNPJ único). Validação de dígitos verificadores fica disponível para reativação futura.
- CRUD e edição de filiais, departamentos, obras e centros de custo, com componente de UI reutilizável e status ativo/inativo.
- Exclusão de empresas (com guarda de dependências) e de unidades organizacionais, com confirmação na interface.
- Menu lateral agrupado em uma seção "Cadastros".
- Módulo de Compras (MVP 1): solicitação de compra com itens, fluxo de aprovação (rascunho → em aprovação → aprovada/rejeitada/devolvida/cancelada) e timeline de eventos por solicitação.
- Schema Prisma inicial do Core Platform, migração `init` e seed (papéis, permissões, categorias e usuário administrador).
- `docker-compose.dev.yml` (PostgreSQL) e arquivos `.env.example` de backend e frontend.
- Documentação do Database Book e do API Book (`docs/04-database`, `docs/05-api`) derivada do schema e dos controllers reais, substituindo os stubs iniciais.
- Cadastros (Empresas, Filiais, Departamentos, Centros de Custo, Obras) nesteados sob Administração → Cadastros no frontend, alinhado ao Blueprint V02.
- Módulo de Fornecedores: cadastro, edição e fluxo de homologação (pré-cadastro → em análise → homologado/homologado com restrição → suspenso/bloqueado/inativo), com timeline de eventos. Backend (`Supplier`, `SupplierEvent`, `/suppliers`) e frontend (lista + detalhe em Administração → Cadastros → Fornecedores).
