# Arquitetura de Identidade e Acesso

## 1. Objetivo

Definir a arquitetura de referência para autenticação, autorização, escopo organizacional, sessões, tokens de segurança e auditoria do Relimpp Connect.

Este documento complementa a RFC-001 e deve ser convertido em ADRs específicos quando decisões tecnológicas forem formalmente aprovadas.

## 2. Princípios

- Segurança por padrão.
- Menor privilégio.
- Backend como autoridade final.
- Separação entre identidade, perfil, permissão, cargo, grupo e escopo.
- Auditoria obrigatória para ações sensíveis.
- Compatibilidade multiempresa.
- Extensibilidade para novos módulos.
- Preparação para SSO e MFA sem dependência imediata.

## 3. Modelo conceitual

```text
Usuário
├── Identidade
├── Credencial
├── Estado da conta
├── Sessões
├── Perfis
│   └── Permissões
├── Grupos
├── Cargos
└── Escopos organizacionais
```

A decisão de acesso deve considerar:

```text
sessão válida
+ usuário ativo
+ permissão exigida
+ escopo compatível
+ regra adicional do recurso
```

## 4. Componentes do Core

### 4.1 Identity Service

Responsável por:

- identidade do usuário;
- dados básicos e profissionais;
- estado da conta;
- convite e primeiro acesso;
- confirmação de e-mail;
- ativação e inativação.

### 4.2 Authentication Service

Responsável por:

- validação de credenciais;
- emissão e renovação de sessão;
- logout;
- recuperação e redefinição de senha;
- aplicação de bloqueio por tentativas;
- tratamento neutro de erros para evitar enumeração.

### 4.3 Authorization Service

Responsável por:

- resolução de perfis;
- resolução de permissões;
- aplicação de escopo;
- autorização por recurso;
- suporte a regras adicionais de domínio.

### 4.4 Session Service

Responsável por:

- criação e persistência de sessões;
- expiração;
- revogação;
- listagem segura;
- encerramento da sessão atual e de outras sessões autorizadas.

### 4.5 Security Policy Service

Responsável por:

- requisitos de senha;
- tentativas e bloqueio;
- duração de tokens;
- duração de sessão;
- políticas futuras de MFA.

### 4.6 Audit Service

Responsável por:

- registrar eventos de segurança e negócio;
- garantir contexto mínimo;
- proteger dados sensíveis;
- disponibilizar consulta autorizada;
- manter integridade e retenção conforme política.

### 4.7 Permission Registry

Catálogo central de permissões.

Módulos futuros devem registrar permissões usando chaves estáveis, evitando alteração manual do Core para cada novo módulo.

Exemplo:

```text
purchasing.requests.view
purchasing.requests.create
purchasing.requests.approve
```

## 5. Separação de conceitos

### Usuário

Pessoa ou identidade técnica que acessa a plataforma.

### Perfil

Conjunto configurável de permissões.

### Permissão

Capacidade granular sobre uma ação ou recurso.

### Grupo

Agrupamento organizacional ou funcional.

### Cargo

Posição hierárquica ou função. Futuramente pode ser utilizada por workflows.

### Escopo

Limite organizacional ou contextual no qual a permissão é válida.

Esses conceitos não devem ser tratados como sinônimos.

## 6. Autenticação e sessão

A estratégia exata de tokens deve ser formalizada por ADR. Independentemente da escolha:

- sessões devem ser revogáveis;
- tokens de renovação, se utilizados, devem possuir rotação e detecção de reutilização quando aplicável;
- dados sensíveis não devem ser armazenados no navegador de forma insegura;
- cookies, se utilizados, devem aplicar `HttpOnly`, `Secure` e política `SameSite` adequada;
- proteção contra CSRF deve ser avaliada conforme o mecanismo escolhido;
- redefinição de senha deve permitir revogar sessões existentes;
- sessão expirada ou revogada deve falhar de forma consistente.

## 7. Tokens de segurança

Convite, confirmação de e-mail e recuperação de senha devem usar tokens:

- criptograficamente seguros;
- de uso único;
- com expiração;
- armazenados em formato não reversível;
- associados a finalidade específica;
- invalidados após consumo;
- auditados sem registrar o valor do token.

## 8. Autorização

### 8.1 Regra de backend

Cada endpoint protegido deve declarar a permissão necessária e aplicar o escopo.

### 8.2 Frontend

O frontend pode ocultar ou desabilitar ações para melhorar UX, mas nunca substitui a autorização de backend.

### 8.3 Escopo organizacional

A consulta deve sempre considerar o contexto organizacional autorizado. Não é permitido buscar todos os registros e filtrar apenas no frontend.

### 8.4 Elevação de privilégio

Alterações em perfil, permissão e escopo exigem permissão específica e não podem permitir autoelevação indevida.

## 9. Modelo de dados conceitual

Entidades mínimas sugeridas:

- User;
- UserCredential;
- UserOrganization;
- Profile;
- Permission;
- ProfilePermission;
- UserProfile;
- Group;
- UserGroup;
- Role;
- UserRole;
- OrganizationalScope;
- UserScope;
- Session;
- SecurityToken;
- SecurityPolicy;
- AuditEvent.

O schema final deve respeitar o modelo multiempresa já definido ou formalizado em ADR.

## 10. Auditoria

Cada evento deve registrar, conforme aplicável:

- `eventId`;
- `occurredAt`;
- `actorUserId`;
- `organizationId`;
- `action`;
- `resourceType`;
- `resourceId`;
- `result`;
- `requestId` ou correlation id;
- IP e user agent quando permitido;
- alterações relevantes sanitizadas.

Nunca registrar:

- senha;
- token integral;
- segredo;
- conteúdo sensível sem necessidade e proteção.

## 11. Fronteiras de módulo

Módulos de negócio podem:

- declarar permissões próprias;
- solicitar autorização ao Core;
- produzir eventos de auditoria;
- consumir identidade e escopo.

Módulos de negócio não podem:

- armazenar senha;
- emitir sessões próprias;
- duplicar catálogo de usuários;
- criar mecanismo paralelo de permissão;
- gravar auditoria incompatível com o padrão central.

## 12. Segurança operacional

- segredos apenas por variáveis e serviço de secrets;
- rate limit em autenticação e recuperação;
- correlação de logs;
- mensagens de erro sanitizadas;
- proteção contra brute force;
- logs de falha sem enumeração;
- dependências atualizadas e avaliadas;
- política de retenção e privacidade.

## 13. Testes obrigatórios

- login válido e inválido;
- bloqueio por tentativas;
- usuário inativo e bloqueado;
- token válido, expirado, consumido e adulterado;
- sessão ativa, expirada e revogada;
- usuário com e sem permissão;
- permissão válida fora do escopo;
- tentativa de autoelevação;
- isolamento entre organizações;
- auditoria sem dados sensíveis.

## 14. Decisões que exigem ADR

- sessão baseada em cookie ou bearer token;
- access/refresh token e rotação;
- algoritmo e parâmetros de hash de senha;
- modelo de tenancy;
- política padrão de segurança;
- provedor de e-mail;
- retenção de auditoria;
- estratégia de MFA e SSO futuros.
