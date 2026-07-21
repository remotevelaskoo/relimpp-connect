# ADR-0006 — Autenticação e autorização

- Status: Proposed
- Data: 2026-07-21

## Contexto

A especificação exige autenticação segura e um modelo de permissão rico: ação × recurso × escopo organizacional, alçadas por valor/categoria, delegação temporária e segregação de funções (seções 5.1 e 21 da [Especificação Funcional Consolidada](../../01-product-book/especificacao-funcional-consolidada.md)). Essas regras condicionam a API, o modelo de dados e os testes, e por isso precisam ser fixadas no início.

## Decisão proposta

- **Autenticação:** JWT de curta duração com refresh token; política de senha, bloqueio por tentativas e expiração de sessão. MFA fica como evolução futura (não bloqueia o MVP).
- **Autorização (RBAC + escopo):** permissões expressas como `recurso:ação` (ex.: `purchase_request:approve`) avaliadas dentro de um **escopo organizacional** (empresa/filial/departamento/obra/centro de custo). Um usuário possui um ou mais vínculos papel+escopo.
- **Alçadas:** regras adicionais por valor total, categoria ou unidade organizacional, avaliadas pelo Workflow Engine (ADR-0003) além do RBAC.
- **Segregação de funções:** impedir, por configuração, que a mesma pessoa acumule solicitar, aprovar, comprar e receber sem controle.
- **Delegação temporária:** transferência de aprovação com início/fim, registrada e auditada.
- **Auditoria:** acesso, alteração, decisão e exportação sempre registrados; dados sensíveis mascarados por perfil.

## Consequências

- A camada de autorização é transversal (guard/policy) e deve existir antes da primeira rota protegida.
- O modelo de dados inclui `Role`, `Permission`, `UserRoleScope` e `Delegation` desde a Fundação.
- Testes de permissão tornam-se suíte obrigatória (RBAC + escopo + segregação).
- Introduzir MFA ou federação de identidade no futuro poderá exigir ajuste desta ADR.
