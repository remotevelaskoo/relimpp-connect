# Guia de Contribuição

## Fluxo de trabalho

1. Selecione uma Issue aprovada.
2. Crie uma branch a partir da branch de desenvolvimento.
3. Implemente somente o escopo da Issue.
4. Atualize testes e documentação.
5. Abra um Pull Request vinculado à Issue.
6. Aguarde revisão e validação.

## Padrão de branches

```text
feature/<numero-issue>-descricao
fix/<numero-issue>-descricao
docs/<numero-issue>-descricao
refactor/<numero-issue>-descricao
```

Exemplo:

```text
feature/42-cadastro-fornecedor
```

## Commits

Use mensagens claras:

```text
feat: adiciona cadastro básico de fornecedor
fix: corrige validação de CNPJ
docs: registra ADR de autenticação
test: adiciona casos de teste de permissões
```

## Definition of Done

Uma tarefa só pode ser concluída quando:

- critérios de aceite atendidos;
- testes executados;
- revisão de código aprovada;
- documentação atualizada;
- permissões validadas;
- auditoria validada, quando aplicável;
- homologação funcional realizada.
