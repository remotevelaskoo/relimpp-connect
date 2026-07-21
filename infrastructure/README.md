# Infrastructure

Deploy, ambientes e infraestrutura do Relimpp Connect.

## Desenvolvimento local

`docker/docker-compose.dev.yml` sobe as dependências de infraestrutura (PostgreSQL). O backend e o
frontend rodam localmente em modo dev.

```bash
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d
```

Depois, siga os READMEs de `../backend` e `../frontend`.

Este diretório evoluirá para conter Dockerfiles de aplicação, CI/CD, observabilidade e configuração
dos ambientes (desenvolvimento, homologação e produção).
