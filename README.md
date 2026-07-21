# Relimpp Connect

**Plataforma Corporativa Inteligente** desenvolvida pela Soluções do Vale.

> Conectar processos, pessoas e sistemas sem criar dependência obrigatória de plataformas externas.

## Status

Produto em fase de discovery, arquitetura e preparação do MVP técnico.

## Princípios

- Operação independente de ERPs e integrações externas.
- Arquitetura modular.
- Configuração antes de customização.
- Rastreabilidade e auditoria.
- Documentação antes do desenvolvimento.
- Experiência web responsiva e mobile first.
- Integrações opcionais e desacopladas.

## Estrutura do repositório

```text
.
├── .github/          Configurações, templates e automações do GitHub
├── backend/          API e regras de negócio
├── frontend/         Aplicação web
├── database/         Modelo, migrações e documentação de dados
├── docs/             Base oficial de conhecimento do produto
├── infrastructure/   Deploy, ambientes e infraestrutura
└── scripts/          Scripts de apoio
```

## Documentação principal

- [Constituição da plataforma](docs/00-governance/constitution.md)
- [Guia para configurar o GitHub](docs/00-governance/github-setup-guide.md)
- [Product Book](docs/01-product-book/README.md)
- [Engineering Manual](docs/02-engineering-manual/README.md)
- [Architecture Decision Records](docs/03-architecture/adr/README.md)
- [Blueprint de Produto](docs/11-blueprint/README.md)
- [Roadmap](docs/10-roadmap/roadmap.md)

## MVP técnico

O primeiro MVP validará o núcleo compartilhado:

- autenticação;
- usuários e empresas;
- perfis e permissões;
- auditoria;
- documentos;
- formulários configuráveis;
- workflows;
- notificações;
- SLAs;
- timeline;
- dashboard inicial.

O módulo de Compras será construído sobre esse núcleo.

## Tecnologias propostas

As tecnologias ainda deverão ser formalmente aprovadas por ADR.

- Frontend: Next.js, React e TypeScript
- Backend: Node.js, NestJS e TypeScript
- Banco: PostgreSQL
- Armazenamento: serviço compatível com S3
- Documentação de API: OpenAPI
- Contêineres: Docker

## Governança

Nenhuma funcionalidade deve entrar em desenvolvimento sem:

1. objetivo e problema de negócio;
2. requisitos e regras;
3. critérios de aceite;
4. análise de dados e permissões;
5. impacto técnico;
6. plano de testes;
7. documentação vinculada.
