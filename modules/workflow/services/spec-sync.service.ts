import type { ServiceDependencies } from '@/lib/container/types';
import type { WorkflowService } from './workflow.service';

export class SpecSyncService {
  constructor(
    private deps: ServiceDependencies,
    private workflowService: WorkflowService,
  ) {}
}
