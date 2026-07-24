# ADR-0007 — Role, Position, Group e Scope

- Status: Accepted
- Data: 2026-07-23
- Escopo: Central de Identidade e Segurança

## Contexto

O projeto já utiliza `Role` no modelo de autorização. A documentação funcional utiliza o termo Perfil e também exige os conceitos de Cargo, Grupo e Escopo. Renomear `Role` para `Profile` provocaria migração no banco, APIs, código e testes sem ganho funcional suficiente.

## Decisão

- `Role` representa **Perfil** e concentra permissões no modelo RBAC.
- `Position` representa **Cargo** organizacional ou hierárquico.
- `Group` representa agrupamento organizacional ou funcional.
- `Scope` representa o limite organizacional de atuação e visibilidade.
- `Permission` representa uma autorização atômica sobre recurso e ação.
- `Position` não concede permissões diretamente.
- `Group` não concede permissões implicitamente, salvo regra futura formalmente documentada.
- A autorização efetiva deve ser calculada e validada no backend a partir de Perfil, Permissões e Escopo.

## Consequências

### Positivas

- Preserva o RBAC existente e seus testes.
- Evita migração e renomeação desnecessárias.
- Separa autorização de hierarquia organizacional.
- Mantém espaço para workflows, alçadas e organograma futuros.

### Atenções

- A interface deve traduzir `Role` como Perfil e `Position` como Cargo.
- Desenvolvedores não devem usar Cargo como substituto de Perfil.
- Qualquer associação futura entre Cargo, Grupo e permissões exigirá nova decisão arquitetural.

## Alternativa rejeitada

Renomear `Role` para `Profile`. A alternativa foi rejeitada porque gera alto impacto técnico, risco de regressão e não altera a capacidade funcional do domínio.

## Referências

- `docs/03-architecture/domain-glossary.md`
- `docs/07-modules/security/`
- `docs/02-governance/conventions.md`