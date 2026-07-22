# PostgreSQL local (Windows, sem Docker, sem admin)

Alternativa ao `../docker/docker-compose.dev.yml` para máquinas Windows sem Docker Desktop instalado e
sem privilégios de administrador para instalar o PostgreSQL como serviço.

Usa o pacote [`embedded-postgres`](https://www.npmjs.com/package/embedded-postgres), que baixa e roda os
**binários oficiais do PostgreSQL 16** — não é um banco "de brincadeira", é o mesmo Postgres, só que
iniciado por um script Node em vez de um serviço do sistema.

## Uso

```bash
npm install
npm start
```

Na primeira execução, inicializa o cluster em `./data/` (gitignored) e cria o banco `relimpp_connect`.
Nas próximas, só inicia o servidor existente. Fica escutando em `localhost:5432` com as mesmas credenciais
que `../../backend/.env.example` já espera (`relimpp` / `relimpp`) — não precisa mudar `DATABASE_URL`.

Esse processo precisa continuar rodando enquanto o backend estiver em uso. Para parar:

```bash
npm run stop
```

ou `Ctrl+C` no terminal onde `npm start` está rodando.

## Diferenças em relação ao Docker

- Não inicia automaticamente com o Windows — precisa rodar `npm start` a cada sessão de trabalho.
- Dados ficam em `data/` nesta pasta, não em um volume Docker.
- Sem painel de administração (use `psql` do próprio pacote, em
  `node_modules/@embedded-postgres/windows-x64/native/bin/psql.exe`, ou uma ferramenta como DBeaver
  apontando para `localhost:5432`).

## Quando usar a alternativa com Docker/serviço instalado

Se depois você instalar Docker Desktop ou o PostgreSQL como serviço do Windows (via instalador oficial,
com privilégios de administrador), pode usar `../docker/docker-compose.dev.yml` normalmente — as
credenciais são as mesmas, então não há nada para migrar além de escolher qual dos dois você deixa rodando
na porta 5432 por vez.
