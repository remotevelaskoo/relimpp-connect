# Guia de configuração do GitHub

Este guia foi criado para montar o ambiente inicial sem exigir experiência prévia com GitHub.

## 1. Criar o repositório

1. No GitHub, clique no botão **+**.
2. Selecione **New repository**.
3. Nome: `relimpp-connect`.
4. Descrição: `Plataforma Corporativa Inteligente - Relimpp Connect`.
5. Marque **Private**.
6. Não adicione README, `.gitignore` ou licença, pois este kit já contém esses arquivos.
7. Clique em **Create repository**.

## 2. Enviar este kit

Método mais simples pelo navegador:

1. Descompacte o arquivo do kit no computador.
2. Abra o repositório criado.
3. Clique em **uploading an existing file**.
4. Arraste o conteúdo interno da pasta `relimpp-connect-starter-kit`.
5. Escreva a mensagem: `chore: adiciona estrutura inicial do produto`.
6. Clique em **Commit changes**.

> O navegador pode ter limitações ao enviar muitas pastas. Para uso profissional, instale o GitHub Desktop e escolha **Add an Existing Repository from your Hard Drive**.

## 3. Criar o Project

O Project que já foi criado pode ser mantido.

Crie os seguintes campos:

### Status

- Backlog
- Discovery
- Specification
- UX/UI
- Ready for Development
- Development
- Code Review
- Testing
- Validation
- Release
- Done
- Blocked

### Priority

- Critical
- High
- Medium
- Low

### Module

- Core
- Authentication
- Organization
- Permissions
- Workflow
- Forms
- Notifications
- Documents
- Catalog
- Suppliers
- Purchasing
- Quotations
- Receiving
- Fiscal
- Dashboards
- Infrastructure
- Documentation

### Effort

- XS
- S
- M
- L
- XL

### Work Type

- Epic
- Story
- Task
- Bug
- Discovery
- Documentation
- Technical Debt

### MVP

- MVP 0 - Foundation
- MVP 1 - Purchasing
- MVP 2 - Supplier Portal
- MVP 3 - Receiving
- MVP 4 - Fiscal
- Future

## 4. Criar visualizações

Crie pelo menos estas Views:

1. **Board — Delivery**, agrupada por Status.
2. **Roadmap**, agrupada por MVP.
3. **Backlog**, filtrada para Backlog e Discovery.
4. **My Work**, filtrada pelo responsável.
5. **Architecture & Docs**, filtrada por Module igual a Documentation, Infrastructure ou Core.

## 5. Labels

Abra `Issues > Labels` e crie:

- `epic`
- `story`
- `task`
- `bug`
- `idea`
- `architecture`
- `backend`
- `frontend`
- `database`
- `devops`
- `documentation`
- `security`
- `ux`
- `qa`
- `blocked`
- `priority-critical`

## 6. Milestones

Abra `Issues > Milestones` e crie:

- MVP 0 - Foundation
- MVP 1 - Purchasing
- MVP 2 - Supplier Portal
- MVP 3 - Receiving
- MVP 4 - Fiscal

## 7. Primeiras Epics

Crie Issues usando o template Epic:

1. Core Platform
2. Authentication and Access
3. Organizational Structure
4. No-Code Configuration
5. Workflow and Approvals
6. Corporate Catalog
7. Supplier Management
8. Purchasing Requests
9. Quotations
10. Receiving
11. Dashboards
12. Product Documentation
13. Infrastructure and DevOps

## 8. Regra de uso

- Ideia ainda não analisada: Issue `IDEA`.
- Capacidade grande: `EPIC`.
- Valor percebido pelo usuário: `STORY`.
- Trabalho técnico: `TASK`.
- Falha: `BUG`.
- Discussão estrutural: GitHub Discussions.
- Decisão aprovada: ADR dentro de `docs/03-architecture/adr`.
