import type * as schema from '@/lib/db';
import type { CustomLogger } from '@/lib/logger';
import type { EmailService } from '@/lib/services/email';
import type { PaymentService } from '@/modules/payments/services/payment.service';
import type { PostService } from '@/modules/posts/services/post.service';
import type { UserService } from '@/modules/users/services/user.service';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

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
}

export interface ServiceDependencies {
  db: PostgresJsDatabase<typeof schema>;
  logger: CustomLogger;
  // Add reference to services for composition
  services?: Pick<Container, 'userService' | 'postService' | 'paymentService' | 'emailService'>;
}

// Service extraction types for better DX
export type Services = Pick<
  Container,
  'userService' | 'postService' | 'paymentService' | 'emailService'
>;
export type ServiceName = keyof Services;
export type ServiceInstance<T extends ServiceName> = Services[T];

// Helper type for service access patterns
export interface ServiceAccessor {
  getService<T extends ServiceName>(serviceName: T): ServiceInstance<T>;
  getServices<T extends ServiceName[]>(...serviceNames: T): Pick<Services, T[number]>;
  getAllServices(): Services;
}
