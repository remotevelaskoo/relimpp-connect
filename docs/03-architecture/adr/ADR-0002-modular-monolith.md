# ADR-0002 — Monólito modular no início

- Status: Proposed
- Data: 2026-07-21

## Contexto

O produto precisa crescer de forma organizada sem introduzir prematuramente a complexidade operacional de microsserviços.

## Decisão proposta

Iniciar com monólito modular, organizado por domínios, com contratos claros e comunicação interna orientada a eventos.

## Consequências

- Deploy inicial mais simples.
- Menor custo operacional.
- Domínios poderão ser separados futuramente.
- Regras de dependência entre módulos deverão ser fiscalizadas.
