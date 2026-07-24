# RFC-001 — Central de Identidade e Segurança

- Status: Proposta para aprovação
- Fase: Sprint 001
- Produto: Relimpp Connect
- Responsável de produto: Product Owner Relimpp Connect
- Responsável técnico: Arquitetura do Produto

## 1. Objetivo

Definir a fundação compartilhada de identidade, autenticação, autorização, escopo organizacional, sessões, auditoria e políticas de segurança do Relimpp Connect.

Esta fundação deve ser consumida por todos os módulos futuros. Nenhum módulo de negócio poderá implementar autenticação, perfis, permissões ou auditoria próprios.

## 2. Problema de negócio

A plataforma precisa crescer por módulos sem perder controle centralizado sobre:

- quem é o usuário;
- em nome de qual organização ele atua;
- quais ações pode executar;
- sobre quais empresas, filiais, departamentos ou registros possui alcance;
- quais sessões estão ativas;
- quem realizou cada alteração relevante.

Sem esse núcleo, cada módulo tenderia a criar regras próprias, gerando duplicação, falhas de segurança, inconsistência e alto custo de manutenção.

## 3. Resultado esperado

Ao término da Sprint 001, a plataforma deverá possuir uma base segura e extensível para:

- autenticar usuários;
- administrar o ciclo de vida de contas;
- atribuir perfis e permissões;
- limitar acesso por escopo organizacional;
- administrar sessões;
- aplicar políticas de senha e bloqueio;
- registrar auditoria de ações sensíveis;
- permitir que módulos futuros registrem recursos e permissões sem alterar a essência do Core.

## 4. Escopo funcional

### 4.1 Autenticação

Inclui:

- login por e-mail e senha;
- logout;
- renovação de sessão conforme estratégia técnica aprovada;
- recuperação de senha;
- redefinição de senha;
- primeiro acesso;
- confirmação de e-mail;
- bloqueio após tentativas inválidas conforme política;
- mensagens de erro que não permitam enumeração de contas.

SSO deve ser previsto na arquitetura, mas sua integração com provedores externos não faz parte da primeira implementação.

### 4.2 Usuários

Inclui:

- criação administrativa ou por convite;
- edição de dados básicos e profissionais;
- ativação e inativação;
- exclusão lógica quando aplicável;
- associação a organizações e escopos;
- associação a perfis;
- visualização do status da conta;
- histórico de alterações sensíveis.

### 4.3 Perfis

Perfil é um agrupador configurável de permissões.

Perfis iniciais de referência:

- Administrador;
- Diretor;
- Gestor;
- Usuário;
- Leitura.

Esses perfis não devem ser codificados como única possibilidade. O sistema deve permitir perfis configuráveis.

### 4.4 Permissões

Permissões devem ser granulares e identificadas por chave estável, por exemplo:

```text
security.users.view
security.users.create
security.users.update
security.users.activate
security.users.deactivate
security.profiles.manage
security.sessions.revoke
security.audit.view
```

O backend é a autoridade final de autorização.

### 4.5 Grupos e cargos

- Grupo representa agrupamento organizacional ou funcional.
- Cargo representa posição ou função hierárquica.
- Grupo e cargo não substituem perfil ou permissão.
- Cargos poderão ser utilizados posteriormente por workflows de aprovação.

### 4.6 Escopo organizacional

A autorização deve combinar:

```text
Usuário + Perfil + Permissão + Escopo organizacional
```

O escopo poderá limitar o acesso por organização, empresa, filial, departamento, unidade ou outro nível aprovado pelo modelo organizacional.

A existência de uma permissão não concede acesso global automaticamente.

### 4.7 Sessões

Inclui:

- criação segura de sessão;
- expiração;
- revogação;
- encerramento da sessão atual;
- encerramento de outras sessões do próprio usuário;
- encerramento administrativo quando autorizado;
- identificação básica de origem, dispositivo e último uso, quando tecnicamente possível e compatível com privacidade;
- rejeição de sessão revogada ou expirada.

### 4.8 Políticas de segurança

Políticas configuráveis devem prever:

- tamanho mínimo de senha;
- complexidade mínima;
- histórico ou reutilização, se aprovado;
- expiração, se aprovada;
- quantidade de tentativas inválidas;
- duração do bloqueio;
- duração dos tokens de convite, confirmação e recuperação;
- duração de sessão.

Valores padrão devem ser definidos tecnicamente e documentados, sem comprometer a possibilidade de configuração futura.

### 4.9 Auditoria e logs

A auditoria deve registrar ações de negócio e segurança relevantes, contendo, quando aplicável:

- ator;
- ação;
- recurso;
- identificador do recurso;
- organização e escopo;
- data e hora;
- contexto da requisição;
- valores anteriores e posteriores com proteção de dados sensíveis;
- resultado da ação.

Eventos mínimos:

- login bem-sucedido;
- login rejeitado;
- logout;
- bloqueio e desbloqueio;
- recuperação e redefinição de senha;
- criação, ativação e inativação de usuário;
- alteração de perfil, permissão ou escopo;
- revogação de sessão;
- mudança de política de segurança.

Senhas, tokens e segredos nunca devem ser gravados em logs.

## 5. Regras de negócio

1. E-mail de autenticação deve ser único dentro da estratégia multiempresa aprovada.
2. Usuário inativo ou bloqueado não pode autenticar.
3. Convites e tokens de recuperação são de uso único e expiram.
4. A redefinição de senha deve invalidar ou permitir invalidar sessões anteriores conforme política.
5. Toda autorização deve ser validada no backend.
6. O frontend deve refletir permissões, mas não pode ser a única barreira de acesso.
7. Usuário não pode ampliar as próprias permissões sem possuir autorização específica e escopo compatível.
8. Alterações de perfil, permissão, escopo e política de segurança devem gerar auditoria.
9. Exclusão de usuário não deve apagar histórico de auditoria.
10. Permissões devem usar chaves estáveis e não dependentes do texto exibido na interface.
11. Módulos futuros devem registrar suas permissões no catálogo central.
12. Operações em lote devem aplicar as mesmas validações de autorização das operações individuais.

## 6. Estados principais

### Usuário

- Pendente de convite;
- Pendente de confirmação;
- Ativo;
- Inativo;
- Bloqueado;
- Excluído logicamente.

### Sessão

- Ativa;
- Expirada;
- Revogada.

### Token de segurança

- Válido;
- Consumido;
- Expirado;
- Revogado.

## 7. Fluxos críticos

### 7.1 Primeiro acesso

```text
Administrador cria ou convida usuário
→ sistema gera token de uso único
→ usuário acessa link
→ confirma identidade/e-mail
→ define senha
→ conta é ativada conforme regra
→ evento é auditado
```

### 7.2 Login

```text
Usuário informa e-mail e senha
→ backend valida credenciais e estado da conta
→ valida política de bloqueio
→ cria sessão
→ retorna contexto autorizado
→ registra auditoria
```

### 7.3 Recuperação de senha

```text
Usuário solicita recuperação
→ sistema retorna mensagem neutra
→ se conta elegível, gera token de uso único
→ usuário redefine senha
→ token é consumido
→ sessões são tratadas conforme política
→ evento é auditado
```

### 7.4 Autorização

```text
Requisição autenticada
→ sessão válida
→ permissão exigida
→ escopo organizacional compatível
→ acesso concedido ou negado
→ ação sensível auditada
```

## 8. Casos de erro obrigatórios

- credencial inválida;
- conta inexistente sem revelação explícita;
- conta inativa;
- conta bloqueada;
- token inválido, consumido ou expirado;
- sessão expirada ou revogada;
- usuário autenticado sem permissão;
- usuário com permissão, porém fora do escopo;
- tentativa de elevar as próprias permissões;
- conflito de e-mail;
- política de senha não atendida;
- falha de envio de comunicação sem perda de consistência transacional.

## 9. Requisitos não funcionais

- segurança por padrão;
- menor privilégio;
- rastreabilidade;
- compatibilidade multiempresa;
- APIs documentadas;
- testes automatizados para fluxos críticos;
- acessibilidade e responsividade;
- desempenho adequado para uso corporativo;
- proteção de dados pessoais conforme LGPD;
- arquitetura preparada para SSO e MFA futuros.

## 10. Critérios de aceite

A fase será considerada pronta quando:

1. todos os fluxos do escopo estiverem implementados ou formalmente divididos em entregas aprovadas;
2. autorização de backend estiver aplicada em todos os endpoints protegidos;
3. escopo organizacional estiver coberto por testes positivos e negativos;
4. tokens de segurança forem de uso único, expiráveis e protegidos em repouso;
5. sessões puderem ser listadas e revogadas conforme permissão;
6. eventos mínimos de auditoria forem registrados sem dados sensíveis;
7. OpenAPI estiver atualizada;
8. migrações forem executáveis em ambiente limpo;
9. testes unitários, integração e E2E críticos estiverem aprovados;
10. telas apresentarem estados de carregamento, vazio, erro, sucesso e acesso negado;
11. documentação técnica e instruções de homologação estiverem atualizadas;
12. nenhuma funcionalidade fora do escopo tiver sido introduzida.

## 11. Fora do escopo

- dashboards executivos ou operacionais;
- BI e indicadores;
- IA;
- Compras;
- Financeiro;
- Workflow de aprovações;
- notificações inteligentes;
- integrações SSO reais;
- MFA, salvo preparação arquitetural;
- gestão organizacional completa além do necessário ao escopo de segurança.

## 12. Dependências e decisões pendentes

Antes da implementação final, devem ser confirmados ou documentados por ADR:

- estratégia de sessão e tokens;
- política padrão de senha e bloqueio;
- modelo definitivo de tenancy e unicidade de e-mail;
- provedor de e-mail transacional;
- retenção de auditoria;
- granularidade inicial do escopo organizacional;
- estratégia futura de MFA e SSO.

## 13. Entregáveis da implementação

- backend e frontend da fase;
- schema e migrations Prisma;
- catálogo inicial de permissões;
- documentação OpenAPI;
- testes;
- seeds mínimos e seguros;
- documentação de configuração;
- relatório de implementação conforme `CLAUDE.md`.
