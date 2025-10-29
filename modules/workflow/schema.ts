// Workflow schema for specs tracking
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const specs = pgTable('specs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  domain: text('domain').notNull(),
  filePath: text('file_path').notNull().unique(),
  status: text('status').notNull().default('pending'),
  scenarioCount: integer('scenario_count').notNull().default(0),
  content: text('content'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});
