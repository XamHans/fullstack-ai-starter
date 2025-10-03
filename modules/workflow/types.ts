import type { specs } from './schema';

export type Spec = typeof specs.$inferSelect;
export type InsertSpec = typeof specs.$inferInsert;

export type SpecStatus = 'pending' | 'in-progress' | 'completed';

export interface CreateSpecInput {
  domain: string;
  featureName: string;
  description: string;
}

export interface UpdateSpecStatusInput {
  status: SpecStatus;
}

export interface SpecMetadata {
  title: string;
  domain: string;
  scenarioCount: number;
}

export interface SyncResult {
  synced: number;
  created: number;
  updated: number;
  errors: string[];
}
