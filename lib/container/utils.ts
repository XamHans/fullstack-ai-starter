import { extractServices, getContainer, getServices } from './index';
import type { Container, ServiceInstance, ServiceName, Services } from './types';

/**
 * Utility functions for enhanced developer experience with the container
 */

// Simplified service access patterns for common use cases
export const useServices = {
  /**
   * Get all business services with destructuring support
   * Usage: const { userService, postService } = useServices.all()
   */
  all: (): Services => getServices(getContainer()),

  /**
   * Get specific services with type safety
   * Usage: const { userService } = useServices.pick('userService')
   */
  pick: <T extends ServiceName[]>(...serviceNames: T): Pick<Services, T[number]> =>
    extractServices(getContainer(), ...serviceNames),

  /**
   * Get a single service with type safety
   * Usage: const userService = useServices.get('userService')
   */
  get: <T extends ServiceName>(serviceName: T): ServiceInstance<T> => getContainer()[serviceName],
};

/**
 * Create a hook-like pattern for API routes
 * Usage: const { userService, postService } = withServices('userService', 'postService')
 */
export function withServices<T extends ServiceName[]>(
  ...serviceNames: T
): Pick<Services, T[number]> {
  return extractServices(getContainer(), ...serviceNames);
}

/**
 * Single service access with better naming
 * Usage: const userService = withService('userService')
 */
export function withService<T extends ServiceName>(serviceName: T): ServiceInstance<T> {
  return getContainer()[serviceName];
}

/**
 * Provides a container context for dependency injection
 * Useful for complex operations that need multiple services
 */
export function withContainer<T>(fn: (container: Container) => T): T {
  return fn(getContainer());
}

/**
 * Type-safe service factory for testing and mocking
 */
export function createServiceMock<T extends ServiceName>(
  serviceName: T,
  mockImplementation: Partial<ServiceInstance<T>>,
): Pick<Services, T> {
  return {
    [serviceName]: mockImplementation,
  } as Pick<Services, T>;
}

/**
 * Helper for type-safe service extension
 */
export type ExtendService<T extends ServiceName, E = {}> = ServiceInstance<T> & E;

/**
 * Utility for creating service-specific error types
 */
export class ServiceError extends Error {
  constructor(
    public readonly serviceName: ServiceName,
    public readonly operation: string,
    message: string,
    public readonly context?: Record<string, any>,
  ) {
    super(`[${serviceName}:${operation}] ${message}`);
    this.name = 'ServiceError';
  }
}

/**
 * Type guard for checking service availability
 */
export function hasService<T extends ServiceName>(
  container: Container,
  serviceName: T,
): container is Container & Record<T, ServiceInstance<T>> {
  return (
    serviceName in container &&
    container[serviceName] !== null &&
    container[serviceName] !== undefined
  );
}

/**
 * Async service operation wrapper with error handling
 */
export async function serviceOperation<T, S extends ServiceName>(
  serviceName: S,
  operation: string,
  fn: (service: ServiceInstance<S>) => Promise<T>,
): Promise<T> {
  try {
    const service = withService(serviceName);
    return await fn(service);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError(
      serviceName,
      operation,
      error instanceof Error ? error.message : String(error),
    );
  }
}
