# Glossário de Domínio — Relimpp Connect

Este documento padroniza os termos de negócio e seus nomes técnicos. Os nomes de entidades existentes devem ser preservados, salvo decisão arquitetural formal.

| Conceito de negócio | Entidade técnica | Responsabilidade |
|---|---|---|
| Usuário | `User` | Pessoa com identidade e acesso à plataforma. |
| Perfil | `Role` | Conjunto reutilizável de permissões do modelo RBAC. |
| Permissão | `Permission` | Autorização atômica para executar uma ação sobre um recurso. |
| Cargo | `Position` | Posição organizacional ou hierárquica do usuário; não concede permissões diretamente. |
| Grupo / Departamento | `Group` | Agrupamento organizacional ou funcional de usuários. |
| Escopo organizacional | `Scope` | Limite de atuação ou visibilidade, como empresa, unidade, departamento ou operação. |
| Sessão | `Session` | Contexto autenticado ativo de um usuário e dispositivo. |
| Política de senha | `PasswordPolicy` | Regras corporativas de criação, renovação e proteção de senhas. |
| Auditoria | `AuditLog` | Registro imutável ou protegido de ações relevantes e seus responsáveis. |
| Log técnico | `Log` | Registro operacional para diagnóstico e observabilidade. |

## Relações fundamentais

- Um `User` pode possuir um ou mais `Role`, conforme o modelo aprovado.
- Um `Role` agrega `Permission`.
- O acesso efetivo resulta das permissões do usuário combinadas com seu `Scope`.
- `Position` representa Cargo e não deve ser utilizado como substituto de `Role`.
- `Group` organiza usuários, mas não concede autorização implicitamente, salvo regra expressamente documentada.
- Toda autorização deve ser resolvida e validada no backend.

## Vocabulário oficial

Na interface em português:

- `Role` deve ser apresentado como **Perfil**.
- `Position` deve ser apresentado como **Cargo**.
- `Group` deve ser apresentado como **Grupo** ou **Departamento**, conforme o contexto validado.
- `Scope` deve ser apresentado como **Escopo**.

Renomeações técnicas que afetem banco, APIs ou código exigem ADR e plano de migração.