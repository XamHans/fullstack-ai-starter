import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createContainer,
  createServiceAccessor,
  extractServices,
  getContainer,
  getService,
  getServices,
  resetContainer,
  setContainer,
} from '../index';
import type { Container, DatabaseConnection } from '../types';
import {
  hasService,
  ServiceError,
  serviceOperation,
  useServices,
  withContainer,
  withService,
  withServices,
} from '../utils';

// Mock the external dependencies
vi.mock('@/modules/users/services/user.service');
vi.mock('@/modules/posts/services/post.service');
vi.mock('@/lib/logger');

describe('Container System', () => {
  let mockDatabase: DatabaseConnection;

  beforeEach(() => {
    resetContainer();

    mockDatabase = {
      db: {} as any,
    };
  });

  describe('createContainer', () => {
    it('should create a container with all services', () => {
      const container = createContainer({
        database: mockDatabase,
      });

      expect(container).toHaveProperty('database');
      expect(container).toHaveProperty('externalServices');
      expect(container).toHaveProperty('userService');
      expect(container).toHaveProperty('postService');
    });

    it('should support service overrides', () => {
      const mockUserService = { name: 'mock-user-service' } as any;

      const container = createContainer({
        database: mockDatabase,
        userService: mockUserService,
      });

      expect(container.userService).toBe(mockUserService);
    });
  });

  describe('Service Access Patterns', () => {
    let container: Container;

    beforeEach(() => {
      container = createContainer({
        database: mockDatabase,
      });
      setContainer(container);
    });

    describe('getServices', () => {
      it('should return all business services', () => {
        const services = getServices(container);

        expect(services).toHaveProperty('userService');
        expect(services).toHaveProperty('postService');
      });
    });

    describe('getService', () => {
      it('should return a specific service', () => {
        const userService = getService(container, 'userService');

        expect(userService).toBe(container.userService);
      });
    });

    describe('extractServices', () => {
      it('should extract multiple services', () => {
        const services = extractServices(container, 'userService', 'postService');

        expect(services).toHaveProperty('userService');
        expect(services).toHaveProperty('postService');
      });

      it('should extract single service', () => {
        const services = extractServices(container, 'userService');

        expect(services).toHaveProperty('userService');
        expect(services).not.toHaveProperty('postService');
      });
    });

    describe('createServiceAccessor', () => {
      it('should create a service accessor', () => {
        const accessor = createServiceAccessor(container);

        expect(accessor.getService('userService')).toBe(container.userService);
        expect(accessor.getAllServices()).toEqual({
          userService: container.userService,
          postService: container.postService,
        });
      });
    });
  });

  describe('Utility Functions', () => {
    let container: Container;

    beforeEach(() => {
      container = createContainer({
        database: mockDatabase,
      });
      setContainer(container);
    });

    describe('withServices', () => {
      it('should extract services using withServices', () => {
        const services = withServices('userService', 'postService');

        expect(services).toHaveProperty('userService');
        expect(services).toHaveProperty('postService');
      });
    });

    describe('withService', () => {
      it('should extract single service using withService', () => {
        const userService = withService('userService');

        expect(userService).toBe(container.userService);
      });
    });

    describe('withContainer', () => {
      it('should provide container context', () => {
        const result = withContainer((c) => {
          expect(c).toBe(container);
          return 'test-result';
        });

        expect(result).toBe('test-result');
      });
    });

    describe('useServices', () => {
      it('should provide all services', () => {
        const services = useServices.all();

        expect(services).toHaveProperty('userService');
        expect(services).toHaveProperty('postService');
      });

      it('should pick specific services', () => {
        const services = useServices.pick('userService');

        expect(services).toHaveProperty('userService');
        expect(services).not.toHaveProperty('postService');
      });

      it('should get single service', () => {
        const userService = useServices.get('userService');

        expect(userService).toBe(container.userService);
      });
    });
  });

  describe('Error Handling', () => {
    describe('ServiceError', () => {
      it('should create proper service error', () => {
        const error = new ServiceError('userService', 'createUser', 'Test error', { id: 123 });

        expect(error.message).toBe('[userService:createUser] Test error');
        expect(error.serviceName).toBe('userService');
        expect(error.operation).toBe('createUser');
        expect(error.context).toEqual({ id: 123 });
      });
    });

    describe('serviceOperation', () => {
      beforeEach(() => {
        const container = createContainer({
          database: mockDatabase,
        });
        setContainer(container);
      });

      it('should wrap service operations', async () => {
        const mockService = {
          testMethod: vi.fn().mockResolvedValue('success'),
        };

        setContainer({
          ...getContainer(),
          userService: mockService as any,
        });

        const result = await serviceOperation('userService', 'testMethod', (service) =>
          service.testMethod(),
        );

        expect(result).toBe('success');
      });

      it('should wrap errors in ServiceError', async () => {
        const mockService = {
          testMethod: vi.fn().mockRejectedValue(new Error('Original error')),
        };

        setContainer({
          ...getContainer(),
          userService: mockService as any,
        });

        await expect(
          serviceOperation('userService', 'testMethod', (service) => service.testMethod()),
        ).rejects.toThrow(ServiceError);
      });
    });
  });

  describe('Type Guards', () => {
    describe('hasService', () => {
      it('should check service availability', () => {
        const container = createContainer({
          database: mockDatabase,
        });

        expect(hasService(container, 'userService')).toBe(true);
        expect(hasService(container, 'postService')).toBe(true);
      });
    });
  });

  describe('Container State Management', () => {
    it('should manage default container', () => {
      // Mock DATABASE_URL for this test
      const originalEnv = process.env.DATABASE_URL;
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

      try {
        expect(() => getContainer()).not.toThrow();

        const container1 = getContainer();
        const container2 = getContainer();

        expect(container1).toBe(container2); // Should be singleton
      } finally {
        // Restore original env
        if (originalEnv) {
          process.env.DATABASE_URL = originalEnv;
        } else {
          delete process.env.DATABASE_URL;
        }
        resetContainer();
      }
    });

    it('should allow setting custom container', () => {
      const customContainer = createContainer({
        database: mockDatabase,
      });

      setContainer(customContainer);

      expect(getContainer()).toBe(customContainer);
    });

    it('should reset container', () => {
      // Set up a container first
      setContainer(
        createContainer({
          database: mockDatabase,
        }),
      );

      const container1 = getContainer();

      resetContainer();

      // Mock DATABASE_URL for the new container
      const originalEnv = process.env.DATABASE_URL;
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

      try {
        const container2 = getContainer();
        expect(container1).not.toBe(container2);
      } finally {
        // Restore original env
        if (originalEnv) {
          process.env.DATABASE_URL = originalEnv;
        } else {
          delete process.env.DATABASE_URL;
        }
        resetContainer();
      }
    });
  });

  describe('Service Composition', () => {
    it('should provide services reference in dependencies', () => {
      const container = createContainer({
        database: mockDatabase,
      });

      // Services should have access to other services through deps
      expect(container.userService).toBeDefined();
      expect(container.postService).toBeDefined();
    });
  });
});
