# Experiência de Login e Autenticação

## 1. Objetivo

Definir a experiência visual e funcional da autenticação do Relimpp Connect para a Sprint 001.

## 2. Direção visual aprovada

A tela deve ser dividida em duas áreas:

### Lado esquerdo

Área funcional de autenticação, limpa e objetiva.

Elementos previstos:

- logotipo Relimpp Connect;
- título de acesso;
- campo de e-mail;
- campo de senha;
- ação principal de entrar;
- link de recuperação de senha;
- link ou orientação para primeiro acesso, quando aplicável;
- feedback de validação e erro;
- informações discretas de suporte e versão, quando disponíveis.

### Lado direito

Área institucional, sem dashboard, gráfico, KPI ou conteúdo operacional.

Texto oficial:

> **Relimpp Connect**  
> **Plataforma Corporativa Inteligente**  
> Conectando pessoas, processos e decisões em uma única plataforma.

A área pode utilizar composição abstrata, ilustração institucional ou elementos visuais da marca, desde que não concorram com o formulário.

## 3. Identidade visual

Direção aprovada:

- fundo branco na área funcional;
- azul petróleo e verde água como cores principais;
- gradiente escuro e elegante na área institucional;
- tipografia ampla e corporativa;
- bastante espaço em branco;
- cards e campos com cantos suavemente arredondados;
- aparência premium, limpa e consistente com uma plataforma SaaS corporativa.

## 4. Conteúdos proibidos nesta fase

- mini dashboard;
- indicadores;
- gráficos;
- cards operacionais;
- atalhos para Compras, Financeiro ou outros módulos;
- credenciais ou acessos de demonstração em produção;
- excesso de mensagens comerciais.

## 5. Estados obrigatórios

A experiência deve prever:

- formulário inicial;
- campo em foco;
- validação local;
- envio em andamento;
- credenciais rejeitadas com mensagem neutra;
- conta temporariamente bloqueada sem exposição indevida;
- sessão expirada;
- erro técnico;
- recuperação solicitada;
- redefinição concluída;
- token inválido ou expirado;
- primeiro acesso concluído;
- confirmação de e-mail concluída.

## 6. Mensagens e segurança

Mensagens de login e recuperação não devem confirmar se um e-mail está cadastrado.

Exemplo de recuperação:

> Se existir uma conta elegível para este e-mail, enviaremos as instruções de recuperação.

Mensagens devem ser claras, curtas e profissionais.

## 7. Acessibilidade

- labels visíveis ou corretamente associados;
- navegação completa por teclado;
- foco perceptível;
- contraste adequado;
- mensagens de erro associadas aos campos;
- suporte a leitores de tela;
- não depender apenas de cor para comunicar estado;
- área de toque adequada em dispositivos móveis.

## 8. Responsividade

Desktop:

- composição dividida em duas áreas.

Tablet:

- preservar hierarquia sem comprimir o formulário.

Mobile:

- priorizar o formulário;
- área institucional pode ser reduzida ou reposicionada;
- nenhum conteúdo essencial pode depender do painel lateral.

## 9. Fluxos relacionados

- Login;
- Recuperar senha;
- Redefinir senha;
- Primeiro acesso;
- Confirmar e-mail;
- Sessão expirada;
- Acesso negado.

Cada fluxo deve possuir rota, estados e critérios de aceite próprios durante a implementação.

## 10. Critérios de aceite de UX

- o formulário é compreensível sem treinamento;
- não há dashboard na tela de login;
- a identidade institucional está presente sem prejudicar o acesso;
- erros não permitem enumeração de usuários;
- todos os estados críticos possuem feedback;
- a experiência funciona em desktop, tablet e celular;
- componentes seguem o Design System existente;
- não há credenciais de demonstração em produção.
