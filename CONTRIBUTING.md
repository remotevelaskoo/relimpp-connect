# Guia de Contribuição — Relimpp Connect

Este documento define o fluxo oficial de contribuição do projeto.

## Fonte de verdade

A documentação versionada no repositório prevalece sobre decisões informais. Antes de implementar, leia:

1. `CLAUDE.md`
2. RFCs e ADRs relacionados
3. arquitetura do módulo
4. documentação de banco e API
5. critérios de aceite da Issue ou Sprint

Em caso de conflito, interrompa a implementação e registre a divergência.

## Fluxo de trabalho

1. Criar ou selecionar uma Issue com escopo e critérios de aceite.
2. Criar branch a partir da base definida.
3. Implementar somente o escopo autorizado.
4. Atualizar testes e documentação.
5. Executar validações locais.
6. Abrir Pull Request com resumo, evidências e pendências.
7. Realizar revisão antes do merge.

## Convenção de branches

- `docs/<assunto>` — documentação e arquitetura.
- `feature/<assunto>` — nova funcionalidade.
- `fix/<assunto>` — correção de defeito.
- `refactor/<assunto>` — melhoria interna sem mudança funcional.
- `test/<assunto>` — testes.
- `chore/<assunto>` — manutenção técnica.

Exemplos:

```text
docs/sprint-001-identity-security
feature/sprint-001-core-security
fix/session-expiration
```

## Commits

Utilize Conventional Commits:

```text
feat(auth): implement login flow
fix(rbac): validate permission scope
refactor(users): simplify user service
test(auth): add login failure scenarios
docs(security): update authentication architecture
chore(ci): update validation workflow
```

Os commits devem ser pequenos, coerentes e reversíveis.

## Pull Request

Todo Pull Request deve informar:

- objetivo;
- Issue ou Sprint relacionada;
- arquivos e módulos afetados;
- alterações de banco e API;
- testes executados;
- evidências relevantes;
- riscos, limitações e pendências;
- documentação atualizada.

## Regras de engenharia

- Não criar decisões arquiteturais sem RFC ou ADR quando aplicável.
- Não duplicar regras de negócio, autenticação ou autorização.
- Toda autorização deve ser validada no backend.
- Toda ação crítica deve produzir auditoria.
- Não misturar módulos ou escopos não autorizados na mesma entrega.
- Não armazenar segredos, credenciais ou dados sensíveis no repositório.
- Mudanças incompatíveis exigem plano de migração.

## Aprovação

Uma entrega só pode ser integrada quando cumprir a Definition of Done em `docs/02-governance/definition-of-done.md`.