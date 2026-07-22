import EmbeddedPostgres from 'embedded-postgres';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const alreadyInitialised = fs.existsSync(path.join(dataDir, 'PG_VERSION'));

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'relimpp',
  password: 'relimpp',
  port: 5432,
  persistent: true,
  authMethod: 'password',
});

async function main() {
  if (!alreadyInitialised) {
    console.log('Primeira execução: inicializando o cluster PostgreSQL...');
    await pg.initialise();
  }
  console.log('Iniciando o servidor PostgreSQL na porta 5432...');
  await pg.start();
  try {
    await pg.createDatabase('relimpp_connect');
    console.log('Banco "relimpp_connect" criado.');
  } catch (err) {
    if (!String(err).includes('already exists')) throw err;
    console.log('Banco "relimpp_connect" já existia.');
  }
  console.log('');
  console.log('PostgreSQL pronto em localhost:5432');
  console.log('DATABASE_URL="postgresql://relimpp:relimpp@localhost:5432/relimpp_connect?schema=public"');
  console.log('');
  console.log('Este processo precisa continuar rodando enquanto você usa o backend.');
  console.log('Para parar: npm run stop (nesta pasta), ou Ctrl+C aqui.');
}

main().catch((err) => {
  console.error('Falha ao iniciar o PostgreSQL local:', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('\nParando o PostgreSQL...');
  await pg.stop();
  process.exit(0);
});
