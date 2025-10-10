// Specification: /specs/workflow/spec-kanban-board.md

import type { NextRequest } from 'next/server';
import {
  ApiError,
  parseRequestBody,
  validateRequiredFields,
  withAuthentication,
} from '@/lib/api/base';
import { withServices } from '@/lib/container/utils';
import type { UpdateSpecStatusInput } from '@/modules/workflow/types';

// GET /api/workflow/specs/[id] - Get a single spec by ID
export const GET = withAuthentication(async (session, request: NextRequest, context: any) => {
  const { workflowService } = withServices('workflowService');

  const params = await context.params;
  const { id } = params;

  const spec = await workflowService.getSpecById(id);

  if (!spec) {
    throw new ApiError(404, 'Spec not found');
  }

  return spec;
});

// PUT /api/workflow/specs/[id] - Update spec status
export const PUT = withAuthentication(async (session, request: NextRequest, context: any) => {
  const { workflowService } = withServices('workflowService');

  const params = await context.params;
  const { id } = params;

  const body = await parseRequestBody<UpdateSpecStatusInput>(request);

  validateRequiredFields(body, ['status']);

  const updated = await workflowService.updateSpecStatus(id, body.status);

  return updated;
});
