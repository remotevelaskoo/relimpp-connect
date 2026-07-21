# Relimpp Connect — Especificação Funcional Consolidada

- Documento: Relimpp Connect — Especificação Funcional Consolidada
- Versão: 1.0
- Data de referência: Julho de 2026
- Responsável pelo produto: Vinicius / Soluções do Vale
- Empresa design partner: Relimpp
- Status: Documento-base para validação com a Relimpp

> Documento confidencial de planejamento — Soluções do Vale.
>
> Fonte: `Proposta_Relimpp_-_SISTEMA.pdf`. Transcrição fiel para versionamento no repositório.
> Esta versão em Markdown é a referência oficial versionada; o PDF permanece como registro histórico.

## Como utilizar este documento

Este documento descreve como o sistema deverá funcionar do ponto de vista do negócio e da operação. Ele não substitui protótipos, especificações técnicas de API, modelo de dados detalhado ou plano de testes, mas será a referência principal para a produção desses artefatos.

**IMPORTANTE:** os pontos identificados como "configuráveis" devem ser administrados pela própria plataforma. Os pontos identificados como "sujeitos à validação" devem ser confirmados durante o levantamento com a Relimpp antes de serem tratados como regra definitiva.

## 1. Visão geral do produto

O Relimpp Connect será a plataforma central de operação da Relimpp. Seu objetivo é organizar e digitalizar processos corporativos, reduzir dependências de planilhas e sistemas desconectados, melhorar a rastreabilidade e permitir que novos módulos sejam incorporados sem reconstruir a base tecnológica.

- **Missão:** conectar sistemas, pessoas e processos em uma única plataforma corporativa.
- **Visão:** tornar-se a camada operacional e de inteligência da Relimpp, oferecendo uma experiência única para solicitações, aprovações, documentos, fornecedores, compras, recebimentos, indicadores e futuras áreas de negócio.
- **O que o sistema é:** uma plataforma corporativa modular, configurável, orientada a processos, dashboards e dados.
- **O que o sistema não é:** não é uma simples substituição do Brickup, não é uma tela sobre o TOTVS RM e não depende de um ERP específico para funcionar.

### 1.4 Objetivos estratégicos

- Centralizar informações operacionais hoje distribuídas em sistemas, planilhas, mensagens e documentos.
- Padronizar solicitações, aprovações, responsabilidades e prazos.
- Aumentar a transparência sobre o andamento de cada processo.
- Reduzir retrabalho, perda de informação e controles manuais.
- Criar uma base corporativa reutilizável para novos módulos.
- Permitir autonomia administrativa por meio de configurações no-code.
- Gerar indicadores executivos e operacionais em tempo real.
- Manter independência de fornecedores e de sistemas legados.

## 2. Problemas que a plataforma pretende resolver

| Problema | Impacto esperado a ser reduzido |
|---|---|
| Fragmentação de informações | Dados espalhados entre Brickup, RM, planilhas, e-mails, WhatsApp e documentos locais. |
| Baixa rastreabilidade | Dificuldade para saber quem solicitou, quem aprovou, o que mudou, quando e por quê. |
| Processos não padronizados | Fluxos dependentes de conhecimento individual e decisões informais. |
| Dependência de pessoas | A operação pode parar quando o responsável não está disponível. |
| Falta de indicadores | Ausência de painéis consolidados de desempenho, prazo, custos, pendências e economia. |
| Retrabalho | Repetição de cadastros, conferências manuais, digitação duplicada e buscas por documentos. |
| Baixa autonomia | Alterações simples de fluxo ou formulário dependem de desenvolvimento ou fornecedores externos. |
| Experiência dispersa | Usuários alternam entre sistemas diferentes para concluir um único processo. |

## 3. Princípios funcionais e arquiteturais

| Princípio | Aplicação no produto |
|---|---|
| Modularidade | Cada módulo funciona de forma independente, usando serviços comuns do Core Platform. |
| Processo antes da tela | O desenho começa pelo fluxo do negócio, responsabilidades, regras e eventos. |
| Dashboard first | Cada perfil visualiza prioridades, pendências e indicadores logo ao entrar. |
| Workflow first | Solicitações e decisões seguem fluxos rastreáveis e configuráveis. |
| Configuração antes de customização | Formulários, aprovações, notificações, SLAs, menus e permissões são configuráveis. |
| Independência de ERP | A plataforma opera mesmo sem integração com TOTVS RM ou outro ERP. |
| Mobile first | Funções operacionais viáveis em celular, inclusive anexos, fotos e aprovações. |
| Timeline em todos os processos | Cada registro relevante possui histórico cronológico completo. |
| IA como assistente | A IA apoia análise, busca, resumo e decisão, mas não substitui controles e aprovações. |
| Segurança e auditoria | Acesso, alteração e decisão são protegidos e registrados. |
| Evolução contínua | Arquitetura permite expansão para contratos, RH, frota, patrimônio, CRM e outros módulos. |

## 4. Estrutura geral da plataforma

A plataforma será organizada em três camadas funcionais: experiência do usuário, núcleo compartilhado e módulos de negócio. A camada de integração será opcional e desacoplada.

```text
RELIMPP CONNECT — EXPERIÊNCIA ÚNICA
  Dashboard Executivo e Operacional
        ↓
  Core Platform: usuários, empresas, permissões, workflow, formulários,
  documentos, timeline, notificações, SLA e auditoria
        ↓
  Módulos de Negócio: Compras, Fornecedores, Catálogo, Recebimento, Fiscal e futuros
        ↓
  Camada Opcional de Integração: TOTVS RM, sistemas internos, APIs, Excel e CSV
```

### 4.1 Áreas principais do menu

| Área | Função |
|---|---|
| Início | Dashboard personalizado, tarefas, alertas e atalhos. |
| Meu Trabalho | Pendências, aprovações, solicitações e atividades do usuário. |
| Operações | Visão consolidada dos processos ativos e gargalos. |
| Compras | Solicitações, cotações, comparações, pedidos e recebimentos. |
| Fornecedores | Cadastro, documentos, homologação, portal e avaliações. |
| Catálogo | Produtos, serviços, equivalentes, preços e fornecedores. |
| Documentos | Biblioteca corporativa e anexos vinculados aos processos. |
| Indicadores | Painéis executivos, operacionais e relatórios. |
| Administração | Configurações, workflows, formulários, SLA, notificações e permissões. |
| Integrações | Importações, exportações, APIs, logs e sincronizações. |

## 5. Perfis de usuário e permissões

O acesso será controlado por função, empresa, filial, departamento, obra, centro de custo e escopo de responsabilidade. Uma mesma pessoa poderá possuir papéis diferentes em contextos distintos.

| Perfil | Responsabilidades principais |
|---|---|
| Administrador da Plataforma | Configura módulos, usuários, permissões, workflows, formulários, menus, SLA e integrações. |
| Gestor/Diretoria | Acompanha indicadores, aprova itens de maior alçada e consulta riscos e exceções. |
| Gestor de Área | Aprova solicitações, acompanha equipe, prazos e orçamento. |
| Solicitante | Cria solicitações, anexa informações, acompanha status e confirma recebimento. |
| Comprador | Analisa solicitações, abre cotações, convida fornecedores, registra propostas, compara e gera pedidos. |
| Almoxarifado/Recebimento | Registra entregas, divergências, evidências e recebimento parcial ou total. |
| Fiscal/Financeiro | Confere documentos fiscais, vincula pedido, valida dados e encaminha para integração financeira. |
| Fornecedor | Acessa apenas as cotações e documentos que lhe foram disponibilizados. |
| Auditoria/Consulta | Acesso somente leitura conforme escopo autorizado. |

### 5.1 Modelo de permissão

- Permissão por ação: visualizar, criar, editar, cancelar, aprovar, rejeitar, reabrir, exportar e administrar.
- Escopo por empresa, filial, departamento, obra e centro de custo.
- Alçadas configuráveis por valor, categoria, tipo de solicitação ou unidade organizacional.
- Delegação temporária de aprovação durante férias ou afastamentos.
- Segregação de funções para evitar que a mesma pessoa solicite, aprove, compre e receba sem controles.
- Registro de toda alteração de perfil e permissão.

## 6. Core Platform

O Core Platform será a base compartilhada por todos os módulos atuais e futuros.

| Componente | Como deverá funcionar |
|---|---|
| Autenticação e sessão | Login, recuperação de senha, política de senha, bloqueio, expiração, dispositivos e MFA futuro. |
| Estrutura organizacional | Empresas, filiais, departamentos, obras, centros de custo, equipes e hierarquias. |
| Usuários e perfis | Cadastro, vínculo organizacional, papéis, substituições e histórico. |
| Workflow Engine | Fluxos, etapas, transições, condições, alçadas, aprovações e versionamento. |
| Form Builder | Formulários configuráveis, campos condicionais, validações, anexos e seções. |
| Notification Engine | Notificações internas, e-mail e canais futuros. |
| SLA Engine | Prazo por etapa, calendário útil, alertas, escalonamento e indicadores. |
| Document Service | Anexos, versões, categorias, evidências e vínculos. |
| Timeline e auditoria | Eventos cronológicos, comentários, alterações, decisões e exportação. |
| Dashboard Engine | KPIs, cards, gráficos, filtros, listas e widgets. |
| Event Engine | Publicação e consumo de eventos entre módulos. |
| Integration Layer | APIs, importações, exportações, filas, logs e reprocessamento. |

### 6.1 Meu Trabalho

A área Meu Trabalho será a principal tela operacional do usuário, reunindo tudo que exige ação: aprovações pendentes, solicitações devolvidas, cotações próximas do prazo, pedidos aguardando entrega, recebimentos aguardando confirmação, documentos vencendo, tarefas delegadas ou em atraso e alertas de SLA e exceções.

## 7. Central de Configuração No-Code

A Central de Configuração permitirá que administradores adaptem a plataforma às regras da empresa sem alterar código-fonte. As configurações deverão ser versionadas, publicadas e auditadas.

| Configuração | Capacidades |
|---|---|
| Workflow | Etapas, responsáveis, condições, transições, aprovações paralelas ou sequenciais e reabertura. |
| Alçadas | Aprovadores por valor, área, categoria, obra, centro de custo ou risco. |
| Formulários | Campos, seções, obrigatoriedade, máscaras, cálculos, regras condicionais e anexos. |
| Notificações | Destinatários, momento do envio, canal e conteúdo do aviso. |
| SLA | Prazo por etapa, calendário útil, lembretes, escalonamento e tolerância. |
| Permissões | Ações disponíveis por papel e escopo. |
| Menus | Exibir ou ocultar áreas conforme perfil. |
| Categorias | Tipos de compra, fornecedor, documento, ocorrência, produto e serviço. |
| Dashboards | Cards, KPIs, listas, filtros e visões por perfil. |
| Templates | Modelos de e-mail, convite, pedido, relatório e documentos. |

### 7.1 Publicação e versionamento

- Toda configuração terá rascunho, versão publicada, autor e data.
- Alterações futuras não modificarão retroativamente processos já iniciados, salvo ação administrativa controlada.
- Existirá histórico e comparação entre versões.
- Mudanças críticas poderão exigir aprovação de outro administrador.

## 8. Módulo de Compras

O módulo de Compras será a primeira grande capacidade de negócio da plataforma. O processo será tratado do início ao fim, permanecendo ativo até a entrega, confirmação do solicitante e validação fiscal.

```text
NECESSIDADE → SOLICITAÇÃO DE COMPRA → APROVAÇÃO → COTAÇÃO → COMPARAÇÃO E SELEÇÃO
→ PEDIDO DE COMPRA → ENTREGA E RECEBIMENTO → CONFIRMAÇÃO DO SOLICITANTE
→ VALIDAÇÃO FISCAL → CONCLUSÃO
```

### 8.1 Solicitação de compra

| Grupo | Informações previstas |
|---|---|
| Identificação | Número automático, data, solicitante, empresa, filial, departamento, obra e centro de custo. |
| Tipo | Produto, serviço, material recorrente, contratação emergencial ou outra categoria configurável. |
| Justificativa | Motivo, finalidade, impacto, urgência e observações. |
| Itens | Produto/serviço, descrição, especificação, quantidade, unidade, data necessária e local de entrega. |
| Orçamento | Valor estimado, conta gerencial, centro de custo e disponibilidade, quando aplicável. |
| Anexos | Fotos, projetos, links, documentos técnicos, propostas prévias e evidências. |
| Classificação | Prioridade, urgência, criticidade, confidencialidade e categoria. |

### 8.2 Regras da solicitação

- O solicitante poderá salvar como rascunho antes do envio.
- A plataforma validará campos obrigatórios e dados organizacionais.
- Itens do catálogo poderão preencher automaticamente descrição, unidade, especificação e fornecedores sugeridos.
- Solicitações semelhantes poderão ser duplicadas, preservando rastreabilidade.
- Após envio, alterações relevantes gerarão nova versão ou devolução para ajuste.
- O cancelamento exigirá justificativa e ficará registrado na timeline.
- Solicitações emergenciais poderão seguir fluxo diferenciado, mas nunca sem justificativa e auditoria.
- O sistema identificará solicitações duplicadas ou potencialmente agrupáveis.

### 8.3 Aprovação

| Modelo | Funcionamento |
|---|---|
| Sequencial | Um aprovador por vez, seguindo a hierarquia configurada. |
| Paralela | Dois ou mais aprovadores recebem simultaneamente. |
| Por maioria | Aprovação conforme quantidade mínima de votos. |
| Por alçada | Responsável definido pelo valor total ou categoria. |
| Condicional | Etapas adicionais conforme urgência, obra, centro de custo ou tipo de item. |
| Automática | Aplicável somente a regras de baixo risco previamente configuradas. |

O aprovador poderá aprovar, rejeitar, solicitar ajuste, encaminhar ou incluir observação. Rejeição e devolução exigirão justificativa. A aprovação exibirá resumo do impacto financeiro e documentos relevantes. Haverá delegação temporária de aprovador e escalonamento configurável por atraso.

## 9. Catálogo Corporativo

O catálogo será uma base corporativa de produtos e serviços, reduzindo descrições inconsistentes e permitindo análise histórica de preço, fornecedor e consumo.

| Bloco | Conteúdo |
|---|---|
| Identificação | Código interno, nome, descrição, categoria, unidade e status. |
| Especificação | Características técnicas, dimensões, marca preferencial, modelo, material e observações. |
| Mídia | Fotos, manuais, fichas técnicas e certificados. |
| Relacionamentos | Produtos equivalentes, kits, acessórios e itens substitutos. |
| Fornecimento | Fornecedores preferenciais, prazo, preço, condição e validade. |
| Histórico | Último preço, preço médio, variação, compras anteriores e desempenho de entrega. |
| Governança | Responsável pelo cadastro, versão, aprovação e bloqueio. |

Recursos previstos: pesquisa multi-critério; sugestão de equivalentes; aviso de produto inativo/substituído/não homologado; kits e listas recorrentes; histórico de preço por fornecedor e período; importação inicial por Excel/CSV.

## 10. Gestão de Fornecedores

| Dimensão | Como deverá funcionar |
|---|---|
| Cadastro | Razão social, nome fantasia, CNPJ, contatos, endereços, categorias e dados bancários controlados. |
| Documentos | Certidões, contratos, comprovantes, certificados e datas de validade. |
| Homologação | Questionário, análise documental, aprovação, restrições e status. |
| Categorias | Produtos e serviços que o fornecedor está apto a oferecer. |
| Desempenho | Preço, qualidade, prazo, atendimento, divergências e ocorrências. |
| Risco | Documentos vencidos, bloqueios, pendências, dependência e avaliação. |
| Relacionamento | Histórico de cotações, pedidos, mensagens e entregas. |

**Status do fornecedor:** Pré-cadastrado; Em análise; Homologado; Homologado com restrição; Suspenso; Bloqueado; Inativo. Os status e critérios serão configuráveis conforme a política da Relimpp.

## 11. Portal do Fornecedor

O Portal do Fornecedor oferecerá área segura para receber convites, consultar itens, enviar propostas e anexar documentos, sem acesso a informações de concorrentes ou áreas internas da Relimpp.

| Recurso | Descrição |
|---|---|
| Convites | Lista de cotações abertas, prazo e responsável. |
| Visualização | Itens, especificações, quantidades, anexos e condições. |
| Proposta | Preço unitário, total, prazo, condição de pagamento, frete, impostos e observações. |
| Disponibilidade | Marcar item indisponível, substituto ou atendimento parcial. |
| Anexos | Proposta comercial, ficha técnica, certificado e outros documentos. |
| Mensagens | Dúvidas e respostas registradas dentro da cotação. |
| Histórico | Cotações enviadas, status e pedidos recebidos. |

Eventos e notificações do portal: convite enviado; fornecedor visualizou; iniciou preenchimento; enviou proposta; prazo próximo; não respondeu; cotação encerrada; selecionado ou não selecionado.

## 12. Cotação, comparação e seleção

- **Criação da rodada:** o comprador seleciona uma ou mais solicitações aprovadas; itens compatíveis podem ser agrupados; fornecedores são escolhidos do cadastro ou incluídos manualmente; prazo, condições e documentos obrigatórios são definidos na abertura; alterações após envio são notificadas e registradas.
- **Cotação manual:** registrar propostas recebidas por Mercado Livre, Amazon, WhatsApp, telefone, loja física, representante comercial ou outras fontes, identificando origem, responsável, data, evidência e validade.

### 12.3 Mapa comparativo

| Critério | Informações comparadas |
|---|---|
| Preço | Unitário, total, frete, impostos, desconto e custo final. |
| Prazo | Prazo de entrega, disponibilidade e atendimento parcial. |
| Pagamento | Condição, prazo, parcelamento e antecipação. |
| Qualidade | Marca, modelo, especificação, equivalência e documentos. |
| Fornecedor | Homologação, desempenho, ocorrências e risco. |
| Critérios internos | Preferência, contrato, sustentabilidade, localização e política. |

**Seleção:** a menor proposta não será obrigatoriamente a vencedora; a escolha registra justificativa quando não for pelo menor custo final; pode ser por item, lote ou fornecedor; o sistema sugere custo-benefício sem decisão automática definitiva; aprovação adicional pode ser exigida ao superar parâmetros configurados.

## 13. Pedido de Compra

| Etapa | Funcionamento |
|---|---|
| Geração | Criado a partir da seleção aprovada, preservando vínculo com solicitação e cotação. |
| Numeração | Sequência automática por empresa ou regra configurável. |
| Conteúdo | Fornecedor, itens, valores, impostos, condições, local, prazo e instruções. |
| Aprovação | Fluxo opcional conforme valor, categoria ou exceção. |
| Envio | Portal, e-mail e geração de PDF. |
| Aceite | Fornecedor confirma recebimento e condições. |
| Alteração | Aditivo ou revisão com histórico; alterações críticas exigem nova aprovação. |
| Cancelamento | Motivo obrigatório e tratamento de saldos ou entregas em andamento. |

**Status:** Rascunho; Aguardando aprovação; Aprovado; Enviado ao fornecedor; Aceito; Parcialmente entregue; Entregue; Cancelado; Concluído.

## 14. Recebimento e confirmação

O processo de compra não será encerrado na emissão do pedido. A plataforma acompanhará entrega, recebimento, divergências e confirmação do solicitante.

| Bloco | Detalhamento |
|---|---|
| Identificação | Pedido, fornecedor, nota/remessa, data, local e responsável. |
| Itens | Quantidade prevista, recebida, aceita, recusada e pendente. |
| Conferência | Produto, especificação, integridade, validade e embalagem. |
| Evidências | Fotos, assinatura, comprovantes e observações. |
| Ocorrências | Avaria, falta, excesso, atraso, produto incorreto ou divergência de documento. |
| Recebimento parcial | Saldo permanece aberto até conclusão ou cancelamento controlado. |
| Confirmação | Solicitante confirma se recebeu, recebeu parcialmente ou não recebeu. |

Respostas do solicitante: recebido conforme solicitado; recebido parcialmente; recebido com divergência; não recebido. Cada resposta poderá exigir comentário, evidência ou abertura de ocorrência.

## 15. Fiscal e integrações financeiras

Após o recebimento, documentos fiscais serão vinculados ao pedido e conferidos antes de eventual integração com o ERP ou encaminhamento ao financeiro.

| Área | Requisitos |
|---|---|
| Documento | Tipo, número, série, chave, emissão, fornecedor e arquivo. |
| Valores | Produtos, serviços, frete, impostos, descontos e total. |
| Vínculo | Pedido, recebimento, contrato, centro de custo e obra. |
| Conferência | Diferença entre pedido, recebido e faturado. |
| Pendência | Documento ausente, valor divergente, CNPJ incorreto ou item sem vínculo. |
| Aprovação | Validação fiscal e, quando necessário, aprovação de exceção. |
| Integração | Envio opcional ao TOTVS RM ou outro sistema com retorno de status. |

**Regra de independência:** o fluxo interno deverá funcionar mesmo quando a integração com o ERP estiver indisponível. A integração será etapa desacoplada, com fila, log, status e reprocessamento.

## 16. Dashboards, indicadores e inteligência

Cada perfil visualizará dashboards adequados às suas responsabilidades, com filtros por período, empresa, área, obra, centro de custo, categoria, fornecedor e status. Painéis: Executivo, Compras, Gestor, Solicitante, Fornecedor, Recebimento, Fiscal e Saúde da Plataforma.

Indicadores prioritários: tempo médio solicitação→aprovação e aprovação→pedido; percentual de compras emergenciais; economia estimada e realizada; variação de preço por item/categoria; índice de resposta de fornecedores; entrega no prazo; divergências por fornecedor; solicitações devolvidas/canceladas; SLA cumprido por etapa; volume por comprador, área, obra e centro de custo.

**Inteligência Artificial (assistiva):** resumo de processos/timelines; busca em linguagem natural; sugestão de fornecedores; identificação de propostas/preços fora do padrão; detecção de duplicidades; sugestão de descrição/especificação; relatórios narrativos. Decisões formais permanecem com usuários autorizados.

## 17. Documentos, anexos e timeline

- **Documentos:** anexos vinculados a processo, item, fornecedor, pedido, recebimento ou documento fiscal; registro de nome, tipo, tamanho, autor, data, versão e classificação; validade/alerta/aprovação para críticos; permissões respeitando confidencialidade; arquivos substituídos preservados no histórico.
- **Timeline:** cada registro principal possui linha do tempo única, registrando criação/edição, transições, decisões, comunicação, documentos, integrações e SLA.

## 18. Notificações, SLA e eventos

- **Notificações:** interna, e-mail, push futuro, WhatsApp quando aprovado/integrado; preferências por usuário; notificações críticas não desativáveis.
- **SLA:** prazo configurável por processo/etapa/prioridade/área/tipo; calendário útil; pausa controlada; lembretes; escalonamento; indicadores.
- **Event Engine:** módulos se comunicam por eventos, por exemplo `PurchaseRequestCreated`, `ApprovalCompleted`, `QuotationClosed`, `PurchaseOrderIssued`, `DeliveryReceived`, `RequesterConfirmed` e `FiscalValidated`, sem acoplamento excessivo.

## 19. Experiência mobile e usabilidade

Responsividade em computador, tablet e celular; ações rápidas (aprovar, rejeitar, comentar, anexar foto, confirmar recebimento, consultar status); navegação simples com busca global e filtros salvos; acessibilidade; consistência; estados vazios; mensagens de erro claras; feedback de desempenho percebido.

## 20. Integrações com TOTVS RM e outros sistemas

As integrações serão capacidades opcionais. O sistema interno não dependerá de resposta em tempo real do ERP.

| Mecanismo | Quando utilizar |
|---|---|
| API síncrona | Consultas/operações com retorno imediato e disponibilidade adequada. |
| Fila assíncrona | Envio de dados processável posteriormente. |
| Importação Excel/CSV | Carga inicial, transição ou contingência. |
| Exportação | Relatórios ou arquivos para outros sistemas. |
| Webhook/Eventos | Notificação de mudanças para sistemas externos. |
| Middleware | Camada intermediária para segurança, transformação ou governança. |

Requisitos: credenciais fora do código; logs com correlação; status (pendente, processando, concluído, erro, cancelado); reprocessamento; idempotência; mapeamento de códigos internos/externos; monitor de integração.

## 21. Segurança, auditoria e LGPD

| Controle | Requisito |
|---|---|
| Autenticação | Sessões seguras, política de senha, bloqueio e MFA futuro. |
| Autorização | RBAC, escopo organizacional e menor privilégio. |
| Criptografia | HTTPS/TLS e proteção de dados sensíveis armazenados. |
| Auditoria | Registro de acesso, alteração, decisão, exportação e administração. |
| LGPD | Finalidade, minimização, retenção, acesso controlado e atendimento a solicitações. |
| Backups | Rotina automatizada, retenção e testes de restauração. |
| Segregação | Separação entre ambientes e responsabilidades. |
| Incidentes | Logs, alertas e procedimento de resposta. |

Dados sensíveis (pessoais, bancários, fiscais, contratuais) exibidos apenas a perfis autorizados; exportações/consultas sensíveis registradas e, quando aplicável, justificadas.

## 22. Requisitos não funcionais

| Categoria | Expectativa |
|---|---|
| Disponibilidade | Meta por ambiente; produção com monitoramento e contingência. |
| Desempenho | Telas operacionais respondem adequadamente mesmo com crescimento de dados. |
| Escalabilidade | Arquitetura preparada para novos módulos, empresas, filiais e usuários. |
| Manutenibilidade | Código modular, padrões, testes e documentação. |
| Observabilidade | Logs, métricas, rastreamento e alertas. |
| Compatibilidade | Navegadores modernos e experiência responsiva. |
| Portabilidade | Ambientes reproduzíveis por infraestrutura automatizada. |
| Confiabilidade | Transações consistentes, idempotência e recuperação de falhas. |
| Versionamento | APIs, configurações, documentos e releases versionados. |
| Acessibilidade | Boas práticas de contraste, teclado e leitura. |

## 23. Roadmap e fases de implantação

| Fase | Escopo |
|---|---|
| Fase 0 — Descoberta e validação | Levantamento, processos, regras, perfis, indicadores, integrações e protótipos. |
| Fase 1 — Fundação técnica | Autenticação, organização, permissões, workflow, formulários, timeline, notificações e auditoria. |
| Fase 2 — Compras MVP | Solicitação, aprovação, comprador, cotação manual, comparação e pedido. |
| Fase 3 — Portal do Fornecedor | Convites, propostas, anexos, mensagens e histórico. |
| Fase 4 — Recebimento | Entrega, parcial, divergência, evidência e confirmação. |
| Fase 5 — Fiscal | Documentos, conferência e encaminhamento. |
| Fase 6 — Integrações | TOTVS RM e outros sistemas, conforme priorização. |
| Fase 7 — Inteligência e expansão | IA, dashboards avançados e novos módulos. |

Estratégia: implantação progressiva; homologação com usuários-chave; migração mínima e confiável; treinamento por perfil; período assistido; indicadores de adoção; canal formal de melhorias.

## 24. Backlog macro do produto

| Código | Epic | Objetivo |
|---|---|---|
| EPIC 01 | Core Platform | Organização, usuários, autenticação, permissões, auditoria e timeline. |
| EPIC 02 | Workflow Engine | Fluxos, alçadas, transições, condições e versionamento. |
| EPIC 03 | Form Builder | Campos, validações, regras condicionais e anexos. |
| EPIC 04 | Notification/SLA | Alertas, canais, prazo, escalonamento e indicadores. |
| EPIC 05 | Dashboard Engine | KPIs, cards, gráficos, filtros e perfis. |
| EPIC 06 | Catálogo | Produtos, serviços, equivalentes, kits e histórico. |
| EPIC 07 | Fornecedores | Cadastro, homologação, documentos e avaliação. |
| EPIC 08 | Solicitações | Criação, aprovação, devolução, cancelamento e histórico. |
| EPIC 09 | Cotações | Rodadas, convites, propostas, manual e comparativo. |
| EPIC 10 | Pedidos | Geração, aprovação, envio, aceite e alteração. |
| EPIC 11 | Recebimento | Entrega, parcial, divergência e confirmação. |
| EPIC 12 | Fiscal | Documentos, conferência e integração. |
| EPIC 13 | Integrações | APIs, filas, arquivos, monitor e reprocessamento. |
| EPIC 14 | IA | Busca, resumo, recomendações e análise assistiva. |
| EPIC 15 | Administração No-Code | Configuração de toda a plataforma. |

## 25. Critérios de sucesso

| Dimensão | Resultado esperado |
|---|---|
| Adoção | Usuários realizam o processo principal na plataforma, reduzindo canais paralelos. |
| Tempo | Redução do tempo médio de aprovação e compra. |
| Rastreabilidade | Processos relevantes com histórico completo e acessível. |
| Qualidade | Menor quantidade de solicitações incompletas e divergências. |
| Gestão | Diretoria e gestores com indicadores confiáveis. |
| Autonomia | Equipe administra fluxos e formulários sem depender de desenvolvimento. |
| Integração | Falhas externas não interrompem a operação interna. |
| Evolução | Novos módulos utilizam o Core Platform sem duplicar serviços. |

## 26. Pontos pendentes de validação com a Relimpp

| Tema | O que confirmar |
|---|---|
| Estrutura organizacional oficial | Empresas, filiais, departamentos, obras, centros de custo e hierarquia. |
| Fluxos de aprovação | Quem aprova, por quais valores e em quais condições. |
| Política de compras | Quantidade mínima de cotações, exceções, compras emergenciais e contratos. |
| Perfis e segregação | Responsabilidades e restrições entre solicitante, gestor, comprador, recebimento e fiscal. |
| Dados do catálogo | Base existente, qualidade, códigos e responsáveis. |
| Homologação de fornecedores | Documentos, critérios, prazos, responsáveis e bloqueios. |
| Recebimento | Locais, responsáveis, evidências e tratamento de divergências. |
| Fiscal | Documentos, conferências e integração financeira. |
| TOTVS RM | Versão, módulos, APIs disponíveis, permissões e dados a sincronizar. |
| Notificações | Canais permitidos e políticas internas. |
| Indicadores | KPIs prioritários para diretoria e operação. |
| Infraestrutura | Hospedagem, ambientes, identidade, domínio, backup e suporte. |

## Apêndice A — Status sugeridos por processo

| Processo | Status sugeridos |
|---|---|
| Solicitação | Rascunho; Enviada; Em aprovação; Devolvida; Aprovada; Rejeitada; Cancelada; Em compra; Concluída. |
| Cotação | Rascunho; Aberta; Aguardando respostas; Em análise; Encerrada; Cancelada. |
| Pedido | Rascunho; Em aprovação; Aprovado; Enviado; Aceito; Parcialmente entregue; Entregue; Cancelado; Concluído. |
| Recebimento | Aguardando; Parcial; Recebido; Com divergência; Recusado; Concluído. |
| Fornecedor | Pré-cadastro; Em análise; Homologado; Restrito; Suspenso; Bloqueado; Inativo. |
| Documento fiscal | Pendente; Recebido; Em conferência; Divergente; Aprovado; Integrado; Erro de integração. |

## Apêndice B — Regras gerais de auditoria

- Nenhum registro crítico deverá ser excluído fisicamente pela interface comum.
- Cancelamentos deverão preservar o conteúdo e exigir motivo.
- Alterações de dados críticos deverão registrar valor anterior e novo.
- Ações administrativas deverão identificar usuário, data, origem e contexto.
- Exportações sensíveis deverão ser auditadas.
- Integrações deverão utilizar identificador de correlação.
- Comentários e decisões não deverão ser editáveis sem histórico.

## Apêndice C — Diretrizes técnicas iniciais

| Área | Diretriz |
|---|---|
| Frontend | React, Next.js, TypeScript, Tailwind e biblioteca de componentes padronizada. |
| Backend | Node.js com NestJS e arquitetura modular. |
| Banco de dados | PostgreSQL. |
| Arquitetura inicial | Monólito modular preparado para evolução. |
| Autenticação | JWT/sessão segura e RBAC. |
| Comunicação | APIs versionadas e eventos internos. |
| Infraestrutura | Contêineres, CI/CD, ambientes separados e observabilidade. |
| Documentação | Product Book, Engineering Manual, ADRs, RFCs, API Book e Backlog Mestre. |

## Conclusão

O Relimpp Connect deverá ser desenvolvido como produto corporativo de longo prazo. O primeiro objetivo operacional será estruturar o processo de Compras, mas a base será criada para suportar novas áreas sem reconstrução. A próxima decisão recomendada é validar este documento em reunião de descoberta, registrar ajustes e transformar cada seção aprovada em histórias, critérios de aceite, protótipos e especificações técnicas.
