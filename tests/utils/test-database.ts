import { readFileSync } from 'node:fs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import schema from '@/lib/db/schema';

let testDb: any;
let testClient: postgres.Sql | null = null;

export async function setupTestDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required for tests');
  }

  // Create connection
  testClient = postgres(connectionString);
  testDb = drizzle(testClient, { schema });

  try {
    // Create test schema if it doesn't exist
    await testClient`CREATE SCHEMA IF NOT EXISTS test`;

    // Set search path to test schema for migrations
    await testClient`SET search_path TO test`;

    // Read and execute migration SQL in test schema
    const migrationSQL = readFileSync('./lib/db/migrations/0000_stormy_dark_beast.sql', 'utf-8');

    // Execute each statement in the test schema
    const statements = migrationSQL
      .split('-->')
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith('statement-breakpoint'));

    for (const statement of statements) {
      if (statement) {
        try {
          await testClient.unsafe(statement);
        } catch (error: any) {
          // Ignore "already exists" errors on subsequent runs
          if (!error.message?.includes('already exists')) {
            console.warn('Migration statement warning:', error.message);
          }
        }
      }
    }

    // Reset search path
    await testClient`SET search_path TO public`;

    console.log('✅ Test database schema created successfully');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }

  return testDb;
}

export async function teardownTestDatabase() {
  if (testClient) {
    // Optional: Drop test schema (commented out to keep schema for faster subsequent runs)
    // await testClient`DROP SCHEMA IF EXISTS test CASCADE`;

    await testClient.end();
    testClient = null;
    testDb = null;
  }
}

export function getTestDb() {
  return testDb;
}

export async function cleanTestDatabase() {
  if (!testDb || !testClient) {
    throw new Error('Test database not initialized');
  }

  try {
    // Truncate all tables in test schema with CASCADE to handle foreign keys
    await testClient`SET search_path TO test`;
    await testClient`TRUNCATE TABLE specs, posts, "user", "session", "account", verification CASCADE`;
    await testClient`SET search_path TO public`;
  } catch (error) {
    console.error('Failed to clean test database:', error);
    throw error;
  }
}
