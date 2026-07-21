# V08 — Portal do Fornecedor

- Volume: 8 de 13 · Blueprint de Produto
- Status: v0.1

Área externa e segura para o fornecedor receber convites, consultar itens, enviar propostas e anexar
documentos — **sem acesso** a informações de concorrentes ou áreas internas da Relimpp.

## 1. Fluxo ponta a ponta

```text
Comprador abre rodada de cotação e convida fornecedor
        ↓
Fornecedor recebe E-MAIL de convite (link seguro, com prazo)
        ↓
Clica no link → LOGIN do Portal (ou 1º acesso: define senha)
        ↓
DASHBOARD DO FORNECEDOR (convites abertos, prazos, pedidos)
        ↓
Abre a COTAÇÃO (itens, especificações, quantidades, condições, anexos)
        ↓
RESPONDER: preço unit., prazo, condição de pagamento, frete, impostos,
           disponibilidade (item indisponível/substituto/parcial), anexos
        ↓
SALVAR (rascunho) ⇄ editar
        ↓
ENVIAR PROPOSTA  ──►  Cliente (comprador) recebe NOTIFICAÇÃO
        ↓                         ↓
        │                 MAPA COMPARATIVO atualiza automaticamente
        │                         ↓
        │                 Comprador analisa e SELECIONA fornecedor(es)
        ↓                         ↓
Fornecedor recebe resultado ◄──── (selecionado / não selecionado)
        ↓
Se selecionado: recebe o PEDIDO DE COMPRA → pode ACEITAR/confirmar condições
```

## 2. Telas do Portal (ver [V10](v10-catalogo-telas.md), faixa 060–069)

| Tela | Nome | Objetivo |
|---|---|---|
| 060 | Portal — Login / 1º acesso | Autenticação do fornecedor (link do convite) |
| 061 | Portal — Dashboard do Fornecedor | Convites, propostas pendentes, pedidos, documentos |
| 062 | Portal — Cotação (visualização) | Itens, especificações, quantidades, anexos, condições, prazo |
| 063 | Portal — Responder Proposta | Preços, prazos, pagamento, frete, impostos, disponibilidade |
| 064 | Portal — Mensagens da Cotação | Dúvidas e respostas registradas |
| 065 | Portal — Meus Pedidos | Pedidos recebidos e aceite |
| 066 | Portal — Meus Documentos | Certidões/certificados e validades |

## 3. Regras e permissões

- Fornecedor só vê **suas** cotações/pedidos/documentos (escopo estrito — [V07](v07-perfis-permissoes.md)).
- Não visualiza concorrentes, mapa comparativo, nem dados internos.
- Proposta tem **rascunho** e **envio**; após envio, alterações geram nova versão e notificam o comprador.
- Prazo controla a janela de resposta; após o encerramento, o envio é bloqueado.

## 4. Proposta — campos (Tela 063)

- Por item: preço unitário, quantidade atendida, disponibilidade (integral/parcial/indisponível/substituto),
  prazo de entrega, observações.
- Gerais: condição de pagamento, prazo, frete, impostos, validade da proposta, anexos (proposta comercial,
  ficha técnica, certificado).

## 5. Eventos e notificações do Portal

`ConviteEnviado` · `FornecedorVisualizou` · `FornecedorIniciouPreenchimento` · `PropostaEnviada` ·
`PrazoProximoDoVencimento` · `FornecedorNaoRespondeu` · `CotacaoEncerrada` ·
`FornecedorSelecionado` / `FornecedorNaoSelecionado`.

Cada evento alimenta: Timeline da cotação, Centro de Notificações (comprador/fornecedor) e o Mapa
Comparativo.

## 6. Mapa comparativo (lado interno — comprador)

Atualiza automaticamente a cada proposta recebida; compara preço (unit./total/frete/impostos/custo final),
prazo, pagamento, qualidade, fornecedor (homologação/risco) e critérios internos. A seleção pode ser por
item, lote ou fornecedor, exige justificativa quando não for o menor custo, e pode exigir aprovação
adicional por alçada. Ver Especificação sec. 12 e telas da faixa 030–039.
