# Convenções de Engenharia

## Idioma e nomenclatura

- Código, entidades, APIs, commits e nomes técnicos: inglês.
- Documentação funcional e comunicação com usuários: português.
- Classes e tipos: `PascalCase`.
- Funções, variáveis e campos: `camelCase`.
- Constantes: `UPPER_SNAKE_CASE`.
- Arquivos e rotas: `kebab-case`, salvo padrão específico do framework.
- Tabelas e colunas devem seguir o padrão já adotado pelo banco; não introduzir um segundo padrão.

## Organização

- Regras de negócio permanecem no domínio ou serviço apropriado, não na interface.
- Controllers tratam transporte e delegam execução.
- Componentes de interface não substituem validações do backend.
- Código compartilhado só deve ser extraído quando existir reutilização real.
- Não criar pastas genéricas como `utils` ou `helpers` sem responsabilidade claramente definida.

## API

- Contratos devem ser tipados e documentados.
- Entradas devem ser validadas.
- Erros devem possuir formato consistente e não expor detalhes sensíveis.
- Mudanças incompatíveis exigem versionamento ou plano de migração.
- Autorização deve ser aplicada no backend em todos os endpoints protegidos.

## Banco de dados

- Toda alteração estrutural deve possuir migration versionada.
- Migrations aplicadas não devem ser reescritas.
- Operações destrutivas exigem estratégia de preservação ou migração dos dados.
- Índices, restrições e relacionamentos devem refletir as regras de negócio.

## Segurança e auditoria

- Credenciais e segredos nunca devem ser versionados.
- Senhas nunca devem ser armazenadas ou registradas em texto puro.
- Logs não devem expor tokens, senhas ou dados sensíveis desnecessários.
- Toda ação crítica deve registrar ator, ação, alvo, data, resultado e contexto disponível.
- `Role` representa Perfil e concentra permissões.
- `Position` representa Cargo e não possui permissões próprias.

## Testes

- Novas regras de negócio exigem testes.
- Correções devem incluir teste de regressão quando tecnicamente possível.
- Casos positivos, negativos, autorização e limites relevantes devem ser cobertos.
- Testes não devem depender de ordem de execução.

## Documentação

Atualize a documentação na mesma entrega sempre que houver mudança em:

- comportamento funcional;
- arquitetura;
- modelo de dados;
- contrato de API;
- segurança;
- configuração ou implantação.

## Commits e Pull Requests

- Commits pequenos e semânticos.
- Uma entrega não deve misturar escopos independentes.
- Pull Requests devem ser revisáveis, rastreáveis e vinculados ao objetivo da Sprint ou Issue.