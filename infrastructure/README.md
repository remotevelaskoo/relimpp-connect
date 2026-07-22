# Infrastructure

Deploy, ambientes e infraestrutura do Relimpp Connect.

## Desenvolvimento local

`docker/docker-compose.dev.yml` sobe as dependências de infraestrutura (PostgreSQL). O backend e o
frontend rodam localmente em modo dev.

```bash
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d
```

Depois, siga os READMEs de `../backend` e `../frontend`.

### Alternativa sem Docker (Windows, sem privilégios de administrador)

Se não houver Docker disponível e não for possível instalar o PostgreSQL como serviço (exige elevação),
use `local-db-windows/`: um PostgreSQL real (binários oficiais), persistente em disco, rodando com as
mesmas credenciais que `docker-compose.dev.yml` e `backend/.env.example` esperam — não precisa trocar nada
na configuração do backend.

```bash
cd infrastructure/local-db-windows
npm install
npm start   # deixa rodando; Ctrl+C ou "npm run stop" (outro terminal) para parar
```

Diferenças em relação ao Docker: não inicia sozinho com o Windows (precisa rodar `npm start` a cada sessão
de trabalho) e os dados ficam em `local-db-windows/data/` (gitignored) em vez de um volume Docker. Fora
isso, é o mesmo PostgreSQL 16 que qualquer outro ambiente usa.

Este diretório evoluirá para conter Dockerfiles de aplicação, CI/CD, observabilidade e configuração
dos ambientes (desenvolvimento, homologação e produção).
