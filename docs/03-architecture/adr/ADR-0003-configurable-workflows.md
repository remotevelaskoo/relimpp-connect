# ADR-0003 — Workflows configuráveis

- Status: Accepted
- Data: 2026-07-21

## Contexto

Fluxos, alçadas, responsáveis e SLAs variam por empresa, obra, categoria e valor.

## Decisão

Os fluxos deverão ser armazenados como configurações versionadas e executados por um motor de workflow.

## Consequências

- Alterações operacionais não exigirão código na maioria dos casos.
- Publicação deverá possuir rascunho, validação, versão e rollback.
- O motor deverá impedir configurações inseguras ou inconsistentes.
