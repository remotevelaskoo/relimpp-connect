# Instrução de Implementação — Sprint 001

## Destinatário

Claude, atuando como Software Engineer do Relimpp Connect.

## Objetivo

Implementar a Central de Identidade e Segurança conforme a documentação aprovada, sem introduzir funcionalidades fora do escopo.

## Leitura obrigatória

Antes de alterar código, leia integralmente:

1. `CLAUDE.md`;
2. `docs/00-governance/constitution.md`;
3. `docs/02-engineering-manual/README.md`;
4. ADRs vigentes em `docs/03-architecture/adr/`;
5. `docs/03-architecture/identity-access-architecture.md`;
6. `docs/06-ux-ui/login-authentication-experience.md`;
7. `docs/07-modules/security/RFC-001-identity-and-security.md`;
8. Blueprint, Database Book e API Book relacionados.

## Regra de início

Antes de codificar, produza um relatório curto contendo:

- arquitetura atual identificada;
- arquivos e módulos que serão afetados;
- decisões já aprovadas;
- decisões ainda pendentes de ADR;
- plano de implementação por etapas;
- riscos principais.

Não implemente silenciosamente uma decisão pendente relevante. Quando for necessário escolher para prosseguir, crie ou proponha ADR e destaque a decisão.

## Escopo autorizado

- login e logout;
- primeiro acesso;
- confirmação de e-mail;
- recuperação e redefinição de senha;
- usuários;
- perfis configuráveis;
- permissões granulares;
- grupos;
- cargos;
- escopos organizacionais;
- sessões e revogação;
- políticas de senha e bloqueio;
- auditoria e logs de segurança;
- catálogo inicial de permissões;
- OpenAPI;
- migrations, seeds e testes necessários.

## Fora do escopo

- dashboards;
- BI;
- IA;
- Compras;
- Financeiro;
- Workflow;
- notificações inteligentes;
- implementação real de SSO;
- implementação real de MFA;
- refatoração ampla sem relação direta com a fase.

## Ordem recomendada

### Etapa 1 — Diagnóstico e ADRs

- revisar autenticação, tenancy e schema existentes;
- confirmar estratégia de sessão;
- confirmar hashing de senha;
- confirmar unicidade de e-mail e escopo multiempresa;
- registrar ADRs necessários.

### Etapa 2 — Modelo de dados

- projetar entidades e relações;
- criar migrations;
- criar seeds mínimos;
- validar constraints, índices, exclusão lógica e auditoria.

### Etapa 3 — Backend do Core

- identidade e usuários;
- autenticação;
- tokens de segurança;
- sessões;
- perfis e permissões;
- escopos;
- políticas;
- auditoria;
- guards, decorators e serviços compartilhados.

### Etapa 4 — API

- DTOs;
- validações;
- paginação e filtros;
- padronização de erros;
- OpenAPI;
- proteção de endpoints.

### Etapa 5 — Frontend

- login aprovado;
- recuperação e redefinição;
- primeiro acesso e confirmação;
- gestão de usuários;
- gestão de perfis e permissões;
- sessões;
- estados de carregamento, vazio, erro, sucesso e acesso negado.

### Etapa 6 — Testes

- unitários;
- integração;
- autorização e escopo;
- API;
- fluxos críticos E2E;
- migração em banco limpo;
- cenários de segurança negativos.

### Etapa 7 — Documentação e entrega

- atualizar README dos módulos alterados;
- atualizar Database Book e API Book;
- registrar ADRs;
- documentar variáveis de ambiente;
- fornecer instruções de homologação;
- produzir relatório final conforme `CLAUDE.md`.

## Restrições técnicas

- preservar Next.js, React, TypeScript, NestJS, Prisma e PostgreSQL;
- backend é autoridade final de autorização;
- não armazenar senha ou token reversível;
- não registrar segredos em logs;
- não filtrar escopo apenas no frontend;
- não codificar perfis como estrutura fixa;
- não criar mecanismo paralelo de autenticação ou auditoria;
- não adicionar dependência sem justificativa;
- não remover ou quebrar funcionalidade existente sem documentar e obter necessidade técnica clara.

## Critérios de bloqueio

Interrompa e reporte antes de prosseguir quando:

- houver conflito entre Constituição, ADR e RFC;
- a estratégia multiempresa não estiver clara;
- uma decisão de segurança exigir mudança estrutural não aprovada;
- houver risco de perda de dados;
- testes existentes falharem antes das alterações;
- credenciais ou segredos forem encontrados no repositório.

## Commit e Pull Request

Trabalhar em branch própria de implementação.

Sugestão:

```text
feat/sprint-001-identity-security
```

Commits devem ser coesos e convencionais. Exemplos:

```text
feat(auth): implement secure session lifecycle
feat(rbac): add profiles permissions and scopes
feat(security-ui): add authentication and user management flows
test(security): cover authorization and token lifecycle
docs(security): update API database and operational guides
```

O Pull Request deve conter:

- resumo;
- arquivos e módulos principais;
- ADRs criados;
- migrations;
- testes executados e resultados;
- evidências ou passos de validação;
- riscos e pendências;
- checklist dos critérios de aceite da RFC-001.

## Comando principal para Claude

Implemente a Sprint 001 estritamente conforme os documentos indicados. Antes de codificar, apresente diagnóstico, plano e decisões pendentes. Não implemente funcionalidades fora do escopo. Ao finalizar, execute os testes disponíveis, atualize toda a documentação impactada, faça commits coesos e abra Pull Request para revisão, entregando o relatório obrigatório definido em `CLAUDE.md`.
