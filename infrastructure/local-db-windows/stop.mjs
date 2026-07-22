import EmbeddedPostgres from 'embedded-postgres';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pg = new EmbeddedPostgres({
  databaseDir: path.join(__dirname, 'data'),
  user: 'relimpp',
  password: 'relimpp',
  port: 5432,
  persistent: true,
  authMethod: 'password',
});

pg.stop()
  .then(() => console.log('PostgreSQL parado.'))
  .catch((err) => {
    console.error('Falha ao parar (talvez já estivesse parado):', err.message);
    process.exit(1);
  });
