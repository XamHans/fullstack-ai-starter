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

  // Create connection with test schema as default search path
  testClient = postgres(connectionString, {
    onnotice: () => {}, // Suppress notices during tests
  });
  testDb = drizzle(testClient, { schema });

  try {
    // Create test schema if it doesn't exist
    await testClient`CREATE SCHEMA IF NOT EXISTS test`;

    // Set search path to test schema for migrations and all subsequent queries
    await testClient`SET search_path TO test`;

    // Read and execute all migrations in test schema
    const migrations = [
      './lib/db/migrations/0000_stormy_dark_beast.sql',
      './lib/db/migrations/0001_add_households_users_habits.sql',
    ];

    for (const migrationPath of migrations) {
      try {
        const migrationSQL = readFileSync(migrationPath, 'utf-8');

        // Execute each statement in the test schema
        // Split by statement-breakpoint comments
        const statements = migrationSQL
          .split('--> statement-breakpoint')
          .map((s) => s.trim())
          .filter((s) => s && s.length > 0);

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
      } catch (error: any) {
        // Ignore file not found errors for optional migrations
        if (!error.message?.includes('ENOENT')) {
          throw error;
        }
      }
    }

    // Keep search path set to 'test' for all test operations
    // DO NOT reset to public - we want all test queries to use the test schema
    console.log('✅ Test database schema created successfully in "test" schema');
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
    // Search path is already set to 'test' from setupTestDatabase
    await testClient`TRUNCATE TABLE specs, posts, "user", "session", "account", verification, households, users, habits CASCADE`;
  } catch (error) {
    console.error('Failed to clean test database:', error);
    throw error;
  }
}
