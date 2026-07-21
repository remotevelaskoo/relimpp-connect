# V07 — Perfis e Permissões

- Volume: 7 de 13 · Blueprint de Produto
- Status: v0.1
- Referências: Especificação (sec. 5 e 21) e ADR de autenticação/autorização (ver [ADRs](../03-architecture/adr/README.md)).

## 1. Perfis (papéis)

| Perfil | Foco |
|---|---|
| Administrador da Plataforma | Configura módulos, usuários, permissões, workflows, formulários, menus, SLA, integrações |
| Gestor / Diretoria | Indicadores, aprovações de maior alçada, riscos e exceções |
| Gestor de Área | Aprova solicitações, acompanha equipe, prazos e orçamento |
| Solicitante | Cria solicitações, anexa informações, confirma recebimento |
| Comprador | Cotações, convites, propostas, comparação, pedidos |
| Almoxarifado / Recebimento | Entregas, divergências, evidências, recebimento parcial/total |
| Fiscal / Financeiro | Documentos fiscais, conferência, integração financeira |
| Fornecedor | Acesso restrito ao Portal (suas cotações/documentos) |
| Auditoria / Consulta | Somente leitura, conforme escopo |

## 2. Modelo de permissão (RBAC + escopo)

- **Permissão = `recurso:ação`** (ex.: `purchase_request:approve`).
- **Ações:** visualizar, criar, editar, cancelar, aprovar, rejeitar, reabrir, exportar, administrar.
- **Escopo organizacional:** empresa, filial, departamento, obra, centro de custo.
- Um usuário possui **um ou mais vínculos papel + escopo** (uma pessoa pode ter papéis diferentes em
  contextos diferentes).

```text
Usuário → [ (Papel: Gestor de Área) @ (Empresa X / Obra Centro) ]
        → [ (Papel: Solicitante)    @ (Empresa X / Depto Compras) ]
```

## 3. Alçadas

Regras adicionais, além do RBAC, avaliadas pelo Workflow Engine:

- Por **valor total** (faixas), **categoria**, **tipo de solicitação** ou **unidade organizacional**.
- Podem exigir etapas/aprovadores adicionais (condicional).
- Configuráveis na Central No-Code / Workflow ([V09](v09-central-administracao.md)).

## 4. Segregação de funções

Impede, por configuração, que a mesma pessoa acumule etapas conflitantes (ex.: **solicitar + aprovar +
comprar + receber** sem controle). Aplicada nas ações de Meu Trabalho e nas transições de workflow.

## 5. Delegação temporária

- Transferência de aprovação a outro usuário por período (férias/afastamento), com início e fim.
- Registrada e auditada; a delegação aparece na timeline e no perfil.

## 6. Auditoria e LGPD
- Acesso, alteração, decisão e exportação são registrados.
- Dados sensíveis (pessoais, bancários, fiscais) exibidos apenas a perfis autorizados; exportações
  sensíveis auditadas e, quando aplicável, justificadas.

## 7. Telas relacionadas (ver [V10](v10-catalogo-telas.md))
- `Tela 090 — Permissões (papéis, permissões, escopos)`
- `Tela 091 — Alçadas`
- `Tela 015 — Delegações`
