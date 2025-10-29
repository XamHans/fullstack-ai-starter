import type { ServiceDependencies } from '@/lib/container/types';
import type { WorkflowService } from './workflow.service';

export class SpecGeneratorService {
  constructor(
    private deps: ServiceDependencies,
    private workflowService: WorkflowService,
  ) {}
}
