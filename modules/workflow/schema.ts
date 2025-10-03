import { integer, pgSchema, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// Use 'test' schema for test environment, 'public' for production
const isTest = process.env.NODE_ENV === 'test';
const testSchema = pgSchema('test');
const tableHelper = isTest ? testSchema.table : pgTable;

export const specs = tableHelper('specs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  domain: text('domain').notNull(),
  filePath: text('file_path').notNull().unique(),
  status: text('status', { enum: ['pending', 'in-progress', 'completed'] })
    .notNull()
    .default('pending'),
  scenarioCount: integer('scenario_count').notNull().default(0),
  content: text('content'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
});
