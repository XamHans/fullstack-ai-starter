// Specification: /specs/workflow/spec-kanban-board.md

import type { NextRequest } from 'next/server';
import { ApiError, withAuthentication } from '@/lib/api/base';
import { withServices } from '@/lib/container/utils';

// GET /api/workflow/specs/[id]/content - Get spec with full markdown content
export const GET = withAuthentication(async (session, request: NextRequest, context: any) => {
  const { workflowService } = withServices('workflowService');

  const params = await context.params;
  const { id } = params;

  const spec = await workflowService.getSpecById(id);

  if (!spec) {
    throw new ApiError(404, 'Spec not found');
  }

  return {
    id: spec.id,
    title: spec.title,
    domain: spec.domain,
    status: spec.status,
    scenarioCount: spec.scenarioCount,
    filePath: spec.filePath,
    content: spec.content,
    createdAt: spec.createdAt,
    updatedAt: spec.updatedAt,
  };
});
