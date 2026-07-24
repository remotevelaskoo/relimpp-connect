# CLAUDE.md — Relimpp Connect

Este arquivo define as instruções permanentes para qualquer trabalho executado por Claude no repositório `relimpp-connect`.

## 1. Identidade do produto

**Produto:** Relimpp Connect  
**Posicionamento:** Plataforma Corporativa Inteligente  
**Mensagem institucional:** Conectando pessoas, processos e decisões em uma única plataforma.

O Relimpp Connect não deve ser tratado como um ERP tradicional baseado apenas em cadastros. A plataforma deve ser construída como um conjunto de **Centros Operacionais**, apoiados por um núcleo compartilhado de identidade, segurança, organização, workflow, auditoria, notificações, documentos, integrações e inteligência.

## 2. Autoridade dos documentos

Antes de alterar código, leia nesta ordem:

1. `CLAUDE.md`;
2. `docs/00-governance/constitution.md`;
3. `docs/01-product-book/README.md`;
4. `docs/02-engineering-manual/README.md`;
5. `docs/03-architecture/adr/README.md` e ADRs aplicáveis;
6. `docs/11-blueprint/README.md` e volumes relacionados;
7. RFC, regras de negócio, modelo de dados e critérios de aceite da fase atual.

Em caso de conflito:

1. a Constituição prevalece;
2. ADR aceita prevalece sobre proposta informal;
3. RFC aprovada prevalece para o escopo funcional da fase;
4. este arquivo prevalece sobre instruções ocasionais que reduzam qualidade, segurança ou rastreabilidade.

Não preencher lacunas relevantes por suposição. Registre a dúvida ou bloqueio no relatório final.

## 3. Fluxo obrigatório de desenvolvimento

Nenhuma funcionalidade deve ser implementada sem:

1. problema de negócio e objetivo;
2. escopo e fora de escopo;
3. fluxo ou comportamento esperado;
4. regras de negócio;
5. permissões e escopo organizacional;
6. modelo de dados e impacto de migração;
7. contrato de API;
8. critérios de aceite;
9. plano de testes;
10. documentação vinculada.

Fluxo oficial:

```text
Ideia
→ Análise de negócio
→ Fluxo / Wireframe
→ RFC
→ Arquitetura
→ Implementação
→ Testes
→ Revisão
→ Homologação
```

## 4. Arquitetura obrigatória

A stack atual deve ser preservada, salvo ADR aprovado:

- Frontend: Next.js, React e TypeScript;
- Backend: NestJS e TypeScript;
- Persistência: PostgreSQL com Prisma;
- APIs: REST documentada em OpenAPI;
- Infraestrutura: Docker.

Regras estruturais:

- não migrar stack sem ADR;
- não criar arquitetura paralela;
- não duplicar autenticação, autorização, auditoria, notificações, documentos, menus ou dashboards em módulos de negócio;
- módulos de negócio devem consumir serviços do Core;
- regras de negócio não devem residir em componentes visuais;
- controladores devem ser finos;
- acesso a dados deve respeitar camadas e convenções existentes;
- integrações externas devem ser desacopladas e não podem impedir a operação essencial da plataforma;
- toda mudança estrutural relevante exige ADR.

## 5. Segurança

Regras obrigatórias:

- backend sempre valida autenticação, permissão e escopo;
- ocultar botão no frontend não constitui autorização;
- aplicar menor privilégio;
- toda consulta multiempresa deve aplicar escopo organizacional explicitamente;
- nenhuma credencial, token, segredo ou dado sensível deve ser incluído no repositório, log ou resposta de erro;
- senhas devem usar algoritmo apropriado e parametrizado;
- tokens de recuperação, confirmação e primeiro acesso devem ser de uso único, expiráveis e armazenados de forma não reversível;
- ações sensíveis devem gerar auditoria;
- erros de autenticação não devem revelar se uma conta existe;
- mudanças em permissões, perfis, políticas de segurança e sessões devem ser auditáveis.

## 6. Qualidade de código

Todo código deve:

- ser tipado;
- seguir os padrões de lint e formatação existentes;
- ter nomes claros e consistentes;
- evitar funções extensas e responsabilidades múltiplas;
- evitar dependências sem justificativa;
- tratar erros de forma previsível;
- manter compatibilidade com a arquitetura atual;
- incluir validação de entrada;
- incluir testes proporcionais ao risco;
- preservar compatibilidade de API ou documentar quebra intencional.

Não faça refatorações amplas fora do escopo da tarefa sem necessidade comprovada.

## 7. Banco de dados e migrações

- alterações de schema devem ser explícitas e revisáveis;
- não remover dados ou colunas sem plano de migração;
- exclusão lógica deve ser usada quando exigida pelo domínio;
- campos de auditoria devem seguir o padrão existente;
- índices e constraints devem refletir regras reais de integridade;
- seeds devem ser idempotentes sempre que possível;
- migrations devem ser testadas em banco limpo e em banco com dados representativos.

## 8. API

- manter versionamento e padrão de rotas existentes;
- usar DTOs de entrada e saída;
- documentar OpenAPI;
- padronizar paginação, filtros, ordenação e erros;
- não retornar entidades de persistência diretamente;
- não expor campos internos ou sensíveis;
- validar autorização por recurso e por escopo.

## 9. Frontend e UX

- seguir o Design System e os componentes globais existentes;
- priorizar acessibilidade, responsividade e estados claros;
- toda tela deve prever carregamento, vazio, erro, sucesso e ausência de permissão;
- não criar variações visuais locais sem necessidade;
- não inserir dashboards, KPIs ou widgets em telas fora do escopo aprovado;
- textos de interface devem ser claros, profissionais e em português do Brasil, salvo requisito contrário.

## 10. Testes mínimos

Cada entrega deve avaliar a necessidade de:

- testes unitários de regras de negócio;
- testes de integração de persistência e serviços;
- testes de autorização e escopo;
- testes de API;
- testes de componentes e fluxos críticos;
- testes E2E para jornadas críticas;
- testes de migração.

Para segurança, incluir cenários positivos e negativos: acesso autorizado, sem permissão, fora do escopo, token inválido, token expirado, sessão revogada e tentativa de enumeração.

## 11. Forma de execução

Antes de codificar:

1. inspecione os arquivos relacionados;
2. confirme o escopo na RFC;
3. identifique impactos e riscos;
4. apresente plano curto de execução quando a tarefa for ampla.

Durante a implementação:

- faça alterações coesas;
- preserve o padrão do repositório;
- atualize documentação junto com o código;
- não deixe TODO genérico sem referência a issue ou decisão.

Ao concluir, execute validações disponíveis no repositório.

## 12. Relatório obrigatório de entrega

Toda resposta final deve conter:

### Arquivos alterados
Lista objetiva dos arquivos criados, modificados ou removidos.

### Resumo
O que foi implementado e por quê.

### Regras de negócio aplicadas
Regras relevantes efetivamente implementadas.

### Testes executados
Comandos e resultado. Se algo não foi executado, informar claramente.

### Instruções de validação
Passos para revisão e homologação.

### Pontos de extensão
Como a solução suporta os módulos futuros.

### Riscos e pendências
Limitações, decisões ainda não aprovadas e impactos conhecidos.

## 13. Git

- trabalhar em branch específica;
- usar commits claros e convencionais;
- não fazer force push;
- não reescrever histórico compartilhado;
- não misturar documentação, refatoração ampla e funcionalidade não relacionada no mesmo commit;
- abrir Pull Request com resumo, testes, riscos e checklist.

Formato recomendado:

```text
<tipo>(<escopo>): <descrição objetiva>
```

Exemplos:

```text
docs(core): define identity and security foundation
feat(auth): implement session-based authentication
fix(rbac): enforce organizational scope on permission checks
```

## 14. Sprint 001

A primeira fase ativa é a **Central de Identidade e Segurança**.

A implementação só poderá começar após a documentação da fase estar fechada. O escopo aprovado inclui autenticação, usuários, perfis, permissões, grupos, cargos, escopos organizacionais, sessões, auditoria e políticas de segurança.

Não fazem parte desta fase: dashboards, BI, IA, Compras, Financeiro, Workflow e notificações inteligentes.
