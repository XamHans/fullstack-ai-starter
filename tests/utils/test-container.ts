import { vi } from 'vitest';
import type { Container } from '@/lib/container';
import type { DatabaseConnection, ServiceDependencies } from '@/lib/container/types';
import { createLogger } from '@/lib/logger';
import { PostService } from '@/modules/posts/services/post.service';
import { UserService } from '@/modules/users/services/user.service';
import { WorkflowService } from '@/modules/workflow/services/workflow.service';
import { SpecSyncService } from '@/modules/workflow/services/spec-sync.service';
import { SpecGeneratorService } from '@/modules/workflow/services/spec-generator.service';
import { getTestDb } from './test-database';

export function createTestContainer(): Container & {
  dependencies: { db: any };
} {
  // Use real test database
  const testDb = getTestDb();

  if (!testDb) {
    throw new Error(
      'Test database not initialized. Make sure to call setupTestDatabase() in beforeAll()',
    );
  }

  const testDatabase: DatabaseConnection = {
    db: testDb,
  };

  // Create a quieter logger for tests
  const originalLogLevel = process.env.LOG_LEVEL;
  process.env.LOG_LEVEL = 'error'; // Only show errors in tests
  const testLogger = createLogger();
  process.env.LOG_LEVEL = originalLogLevel; // Restore original log level

  // Create service dependencies with test logger
  const serviceDependencies: ServiceDependencies = {
    db: testDb,
    logger: testLogger,
    services: undefined, // Will be set after services are created
  };

  // Create services manually with test dependencies
  const userService = new UserService(serviceDependencies);
  const postService = new PostService(serviceDependencies);
  const workflowService = new WorkflowService(serviceDependencies);
  const specSyncService = new SpecSyncService(serviceDependencies, workflowService);
  const specGeneratorService = new SpecGeneratorService(serviceDependencies, workflowService);

  // Update service dependencies with service references
  serviceDependencies.services = {
    userService,
    postService,
    workflowService,
    specSyncService,
    specGeneratorService,
  };

  const container: Container = {
    database: testDatabase,
    externalServices: {
      geminiClient: {
        generateVideo: vi.fn().mockResolvedValue({ jobId: 'test-job-123' }),
        checkJobStatus: vi.fn().mockResolvedValue({ status: 'completed', videoUrl: 'test-url' }),
      },
      r2Client: {
        uploadVideo: vi.fn().mockResolvedValue({ url: 'test-upload-url' }),
        deleteVideo: vi.fn().mockResolvedValue(true),
      },
    },
    userService,
    postService,
    workflowService,
    specSyncService,
    specGeneratorService,
  };

  return {
    ...container,
    dependencies: {
      db: testDb,
    },
  };
}
