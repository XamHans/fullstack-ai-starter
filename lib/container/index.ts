import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/lib/db';
import { createLogger } from '@/lib/logger';
import { PostService } from '@/modules/posts/services/post.service';
import { UserService } from '@/modules/users/services/user.service';
import { EmailService } from '@/lib/services/email';
import type {
  Container,
  DatabaseConnection,
  ServiceAccessor,
  ServiceDependencies,
  ServiceInstance,
  ServiceName,
  Services,
} from './types';

// Factory function for creating database connection
export function createDatabaseConnection(connectionString?: string): DatabaseConnection {
  const dbUrl = connectionString || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const client = postgres(dbUrl);
  const db = drizzle(client, { schema });

  return { db };
}

// Factory function for creating service dependencies
function createServiceDependencies(
  database: DatabaseConnection,
  services?: Services,
): ServiceDependencies {
  return {
    db: database.db,
    logger: createLogger(), // Remove container service context - let services add their own context
    services,
  };
}

// Factory function for creating the full container
export function createContainer(overrides?: Partial<Container>): Container {
  const database = overrides?.database || createDatabaseConnection();

  // Create services with dependencies (two-phase initialization for circular deps)
  const serviceDependencies = createServiceDependencies(database);

  const userService = overrides?.userService || new UserService(serviceDependencies);
  const postService = overrides?.postService || new PostService(serviceDependencies);
  const emailService = overrides?.emailService || new EmailService();

  // Update service dependencies with service references for composition
  const services: Services = { userService, postService, emailService };
  serviceDependencies.services = services;

  return {
    database,
    externalServices: {
      r2Client: null, // Will be initialized when needed
      ...overrides?.externalServices,
    },
    // Flattened services for direct access
    userService,
    postService,
    emailService,
  };
}

// Service extraction utility functions for better DX
export function getServices(container: Container): Services {
  return {
    userService: container.userService,
    postService: container.postService,
    emailService: container.emailService,
  };
}

export function getService<T extends ServiceName>(
  container: Container,
  serviceName: T,
): ServiceInstance<T> {
  return container[serviceName];
}

// Multiple service extraction with destructuring support
export function extractServices<T extends ServiceName[]>(
  container: Container,
  ...serviceNames: T
): Pick<Services, T[number]> {
  const result = {} as Pick<Services, T[number]>;
  for (const serviceName of serviceNames) {
    result[serviceName] = container[serviceName];
  }
  return result;
}

// Service accessor pattern for advanced use cases
export function createServiceAccessor(container: Container): ServiceAccessor {
  return {
    getService<T extends ServiceName>(serviceName: T): ServiceInstance<T> {
      return container[serviceName];
    },
    getServices<T extends ServiceName[]>(...serviceNames: T): Pick<Services, T[number]> {
      return extractServices(container, ...serviceNames);
    },
    getAllServices(): Services {
      return getServices(container);
    },
  };
}

// Default container for production use
let defaultContainer: Container | null = null;

export function getContainer(): Container {
  if (!defaultContainer) {
    defaultContainer = createContainer();
  }
  return defaultContainer;
}

// For testing - allows setting a custom container
export function setContainer(container: Container): void {
  defaultContainer = container;
}

// For testing - resets to default
export function resetContainer(): void {
  defaultContainer = null;
}

// Export types
export type {
  Container,
  DatabaseConnection,
  ServiceAccessor,
  ServiceInstance,
  ServiceName,
  Services,
} from './types';
