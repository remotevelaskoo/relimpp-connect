# Central de Identidade e Segurança

A Central de Identidade e Segurança é o núcleo compartilhado responsável por autenticação, autorização, usuários, perfis, permissões, escopos organizacionais, sessões, políticas de segurança e auditoria.

Nenhum módulo de negócio pode criar mecanismos próprios para essas capacidades.

## Documentos da Sprint 001

- [RFC-001 — Central de Identidade e Segurança](RFC-001-identity-and-security.md)
- [Arquitetura de Identidade e Acesso](../../03-architecture/identity-access-architecture.md)
- [Experiência de Login e Autenticação](../../06-ux-ui/login-authentication-experience.md)
- [Instrução de Implementação da Sprint 001](implementation-instruction.md)

## Escopo

- login e logout;
- primeiro acesso;
- confirmação de e-mail;
- recuperação e redefinição de senha;
- usuários;
- perfis;
- permissões;
- grupos;
- cargos;
- escopos organizacionais;
- sessões;
- políticas de segurança;
- auditoria e logs de segurança.

## Fora do escopo

- dashboards;
- BI;
- IA;
- Compras;
- Financeiro;
- Workflow;
- notificações inteligentes;
- integração real com SSO ou MFA.

## Regra central

Toda decisão e implementação desta fase deve respeitar `CLAUDE.md`, a Constituição da plataforma, os ADRs vigentes e a RFC-001.
