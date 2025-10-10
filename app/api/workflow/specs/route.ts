// Specification: /specs/workflow/spec-kanban-board.md

import type { NextRequest } from 'next/server';
import {
  parseRequestBody,
  validateRequiredFields,
  withAuthentication,
  withErrorHandling,
} from '@/lib/api/base';
import { withServices } from '@/lib/container/utils';
import type { CreateSpecInput } from '@/modules/workflow/types';

// GET /api/workflow/specs - List all specs
export const GET = withAuthentication(async () => {
  const { workflowService } = withServices('workflowService');

  const specs = await workflowService.getAllSpecs();

  return specs;
});

// POST /api/workflow/specs - Create a new spec
export const POST = withAuthentication(async (session, request: NextRequest) => {
  const { specGeneratorService } = withServices('specGeneratorService');

  const body = await parseRequestBody<CreateSpecInput>(request);

  validateRequiredFields(body, ['domain', 'featureName', 'description']);

  const result = await specGeneratorService.generateSpec(body);

  return result;
});
