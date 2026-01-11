import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type * as schema from '@/lib/db';
import type { CustomLogger } from '@/lib/logger';
import type { EmailService } from '@/lib/services/email';
import type { PaymentService } from '@/modules/payments/services/payment.service';
import type { PostService } from '@/modules/posts/services/post.service';
import type { UserService } from '@/modules/users/services/user.service';
import type { SpecGeneratorService } from '@/modules/workflow/services/spec-generator.service';
import type { SpecSyncService } from '@/modules/workflow/services/spec-sync.service';
import type { WorkflowService } from '@/modules/workflow/services/workflow.service';

export interface DatabaseConnection {
  db: PostgresJsDatabase<typeof schema>;
}

export interface ExternalServices {
  r2Client: any;
}

export interface BusinessServices {
  userService: UserService;
  postService: PostService;
  paymentService: PaymentService;
  emailService: EmailService;
  workflowService: WorkflowService;
  specSyncService: SpecSyncService;
  specGeneratorService: SpecGeneratorService;
}

// Flattened container structure for easier access
export interface Container {
  // Infrastructure dependencies
  database: DatabaseConnection;
  externalServices: ExternalServices;

  // Business services (flattened for direct access)
  userService: UserService;
  postService: PostService;
  paymentService: PaymentService;
  emailService: EmailService;
  workflowService: WorkflowService;
  specSyncService: SpecSyncService;
  specGeneratorService: SpecGeneratorService;
}

export interface ServiceDependencies {
  db: PostgresJsDatabase<typeof schema>;
  logger: CustomLogger;
  // Add reference to services for composition
  services?: Pick<
    Container,
    | 'userService'
    | 'postService'
    | 'paymentService'
    | 'emailService'
    | 'workflowService'
    | 'specSyncService'
    | 'specGeneratorService'
  >;
}

// Service extraction types for better DX
export type Services = Pick<
  Container,
  | 'userService'
  | 'postService'
  | 'paymentService'
  | 'emailService'
  | 'workflowService'
  | 'specSyncService'
  | 'specGeneratorService'
>;
export type ServiceName = keyof Services;
export type ServiceInstance<T extends ServiceName> = Services[T];

// Helper type for service access patterns
export interface ServiceAccessor {
  getService<T extends ServiceName>(serviceName: T): ServiceInstance<T>;
  getServices<T extends ServiceName[]>(...serviceNames: T): Pick<Services, T[number]>;
  getAllServices(): Services;
}
