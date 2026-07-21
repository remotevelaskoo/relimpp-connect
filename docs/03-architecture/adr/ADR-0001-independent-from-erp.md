# ADR-0001 — Independência de ERP

- Status: Accepted
- Data: 2026-07-21

## Contexto

A Relimpp utiliza sistemas corporativos que ainda serão avaliados. A plataforma não deverá ficar tecnicamente presa a uma integração cuja continuidade, qualidade ou aderência ainda não foi confirmada.

## Decisão

O Relimpp Connect deverá operar de forma independente. Integrações com TOTVS RM ou outros sistemas serão opcionais e implementadas em uma camada desacoplada.

## Consequências

- O Connect possuirá cadastros e regras operacionais próprios.
- Importações iniciais poderão ocorrer por arquivos.
- Indisponibilidade externa não poderá interromper processos essenciais.
- Sincronização e propriedade de cada dado deverão ser definidas por integração.
