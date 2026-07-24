# Definition of Done

Uma tarefa, história, módulo ou Sprint só pode ser considerada concluída quando todos os itens aplicáveis abaixo forem atendidos.

## Produto

- Escopo autorizado implementado sem inclusão silenciosa de funcionalidades externas.
- Critérios de aceite atendidos e demonstráveis.
- Estados de carregamento, vazio, sucesso, erro e acesso negado tratados quando aplicáveis.
- Textos e experiência aderentes à documentação aprovada.

## Arquitetura e código

- Implementação aderente às RFCs, ADRs e padrões do projeto.
- Código tipado, legível e sem duplicações relevantes.
- Tratamento de erros e logs implementados.
- Nenhum segredo ou dado sensível exposto.
- Dívidas técnicas e decisões provisórias registradas.

## Segurança

- Autenticação e autorização validadas no backend.
- Permissões e escopos testados para acesso permitido e negado.
- Ações críticas auditadas.
- Dados sensíveis protegidos em armazenamento, transporte e logs conforme aplicável.

## Banco e API

- Migrations criadas e testadas quando necessárias.
- Contratos de API documentados e compatíveis com o consumidor.
- Validações de entrada e respostas de erro verificadas.
- Impactos de compatibilidade e migração documentados.

## Testes e validação

- Testes automatizados relevantes implementados e executados.
- Teste de regressão adicionado para correções, quando possível.
- Build, lint, typecheck e suíte de testes aprovados.
- Validação funcional ou evidência equivalente registrada.

## Documentação e entrega

- Documentação funcional, técnica, API e banco atualizada.
- Pull Request contém objetivo, alterações, testes, riscos e pendências.
- Revisão concluída e apontamentos resolvidos ou formalmente aceitos.
- Changelog ou registro da Sprint atualizado quando aplicável.

## Bloqueio de conclusão

Qualquer item crítico pendente de segurança, integridade de dados, autorização, auditoria ou critério de aceite impede a conclusão.