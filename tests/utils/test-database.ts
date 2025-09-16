import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { schema } from '@/lib/db';

let container: PostgreSqlContainer;
let testDb: any;

export async function setupTestDatabase() {
  // Start PostgreSQL container
  container = await new PostgreSqlContainer('postgres:15')
    .withDatabase('test_db')
    .withUsername('test_user')
    .withPassword('test_password')
    .start();

  // Create database connection
  const connectionString = container.getConnectionUri();
  const client = postgres(connectionString);
  testDb = drizzle(client, { schema });

  try {
    await migrate(testDb, { migrationsFolder: './lib/db/migrations' });
  } catch (error) {
    console.warn('No migrations found, continuing with empty database');
  }

  return testDb;
}

export async function teardownTestDatabase() {
  if (container) {
    await container.stop();
  }
}

export function getTestDb() {
  if (!testDb) {
    console.warn('Test database not initialized, using mock database');
    return null;
  }
  return testDb;
}

export async function cleanTestDatabase() {
  if (testDb) {
    // Clean all tables in reverse dependency order
    await testDb.delete(schema.videos);
    await testDb.delete(schema.galleries);
    await testDb.delete(schema.users);
    await testDb.delete(schema.promptTemplates);
  }
}
