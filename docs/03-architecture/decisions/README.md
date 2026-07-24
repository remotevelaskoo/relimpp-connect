# Architecture Decision Records

Esta pasta registra decisões arquiteturais relevantes do Relimpp Connect.

## Quando criar um ADR

Crie um ADR quando uma decisão:

- alterar estrutura, integração, segurança ou modelo de dados;
- afetar mais de um módulo;
- introduzir padrão duradouro;
- possuir alternativas relevantes;
- exigir migração ou gerar impacto futuro.

## Status permitidos

- `Proposed` — em análise.
- `Accepted` — aprovado e vigente.
- `Superseded` — substituído por outro ADR.
- `Deprecated` — não recomendado para novas implementações.
- `Rejected` — avaliado e não adotado.

## Convenção

```text
ADR-NNNN-titulo-em-kebab-case.md
```

Cada ADR deve conter contexto, decisão, alternativas, consequências e referências.

## Registro

| ADR | Decisão | Status |
|---|---|---|
| [ADR-0007](ADR-0007-role-position-group-scope.md) | Separação entre Perfil, Cargo, Grupo e Escopo | Accepted |

A numeração deve respeitar os ADRs já existentes no repositório e nunca deve ser reutilizada.