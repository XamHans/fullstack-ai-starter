// Specification: /specs/workflow/spec-kanban-board.md

import path from 'node:path';
import { withAuthentication } from '@/lib/api/base';
import { withServices } from '@/lib/container/utils';

// POST /api/workflow/sync - Sync specs from filesystem
export const POST = withAuthentication(async () => {
  const { specSyncService } = withServices('specSyncService');

  // Get the specs directory path (relative to project root)
  const specsDir = path.join(process.cwd(), 'specs');

  const result = await specSyncService.syncSpecsFromFilesystem(specsDir);

  return {
    message: `Synced ${result.synced} specs from filesystem`,
    ...result,
  };
});
