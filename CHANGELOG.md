# Changelog

Todas as alterações relevantes do produto serão registradas neste arquivo.

O formato seguirá os princípios de **Keep a Changelog** e versionamento semântico quando o produto iniciar suas versões publicáveis.

## [Não lançado]

### Adicionado

- Estrutura inicial de governança e documentação.
- Templates de Issues e Pull Requests.
- ADRs iniciais da plataforma.
- Scaffolding executável do MVP 0 (Fundação): backend NestJS + Prisma (auth JWT, empresas, health) e frontend Next.js (login, "Meu Trabalho", empresas).
- Edição de empresas e padronização de CNPJ (máscara `xx.xxx.xxx/xxxx-xx`, validação estrutural de 14 dígitos e CNPJ único). Validação de dígitos verificadores fica disponível para reativação futura.
- CRUD e edição de filiais, departamentos, obras e centros de custo, com componente de UI reutilizável e status ativo/inativo.
- Exclusão de empresas (com guarda de dependências) e de unidades organizacionais, com confirmação na interface.
- Menu lateral agrupado em uma seção "Cadastros".
- Módulo de Compras (MVP 1): solicitação de compra com itens, fluxo de aprovação (rascunho → em aprovação → aprovada/rejeitada/devolvida/cancelada) e timeline de eventos por solicitação.
- Schema Prisma inicial do Core Platform, migração `init` e seed (papéis, permissões, categorias e usuário administrador).
- `docker-compose.dev.yml` (PostgreSQL) e arquivos `.env.example` de backend e frontend.
