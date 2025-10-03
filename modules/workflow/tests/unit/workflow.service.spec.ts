// Specification: /specs/workflow/spec-kanban-board.md

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestContainer } from '@/tests/utils/test-container';
import {
  cleanTestDatabase,
  setupTestDatabase,
  teardownTestDatabase,
} from '@/tests/utils/test-database';
import type { WorkflowService } from '../../services/workflow.service';
import type { SpecStatus } from '../../types';

describe('Feature: Spec Kanban Board - WorkflowService', () => {
  let workflowService: WorkflowService;
  let testContainer: any;

  beforeAll(async () => {
    try {
      await setupTestDatabase();
    } catch (error) {
      console.warn('Docker not available, using mock database');
    }
  });

  afterAll(async () => {
    try {
      await teardownTestDatabase();
    } catch (error) {
      // Ignore teardown errors when using mock database
    }
  });

  beforeEach(async () => {
    try {
      await cleanTestDatabase();
    } catch (error) {
      // Ignore cleanup errors when using mock database
    }
    testContainer = createTestContainer();
    workflowService = testContainer.workflowService;
  });

  describe('Scenario: View Specs Organized by Workflow Stage (Unit Tests)', () => {
    it('should retrieve all specs from database', async () => {
      // GIVEN: 3 spec files with different statuses have been synced to the database
      await workflowService.createSpec({
        title: 'Create Post',
        domain: 'posts',
        filePath: 'specs/posts/create-post.md',
        status: 'pending',
        scenarioCount: 3,
      });

      await workflowService.createSpec({
        title: 'Archive Posts',
        domain: 'posts',
        filePath: 'specs/posts/archive-posts.md',
        status: 'in-progress',
        scenarioCount: 5,
      });

      await workflowService.createSpec({
        title: 'User Profile',
        domain: 'users',
        filePath: 'specs/users/user-profile.md',
        status: 'completed',
        scenarioCount: 4,
      });

      // WHEN: I retrieve all specs
      const specs = await workflowService.getAllSpecs();

      // THEN: I should see all 3 specs with correct data
      expect(specs).toHaveLength(3);
      expect(specs.find((s) => s.title === 'Create Post')).toMatchObject({
        domain: 'posts',
        status: 'pending',
        scenarioCount: 3,
      });
      expect(specs.find((s) => s.title === 'Archive Posts')).toMatchObject({
        domain: 'posts',
        status: 'in-progress',
        scenarioCount: 5,
      });
      expect(specs.find((s) => s.title === 'User Profile')).toMatchObject({
        domain: 'users',
        status: 'completed',
        scenarioCount: 4,
      });
    });

    it('should organize specs by status', async () => {
      // GIVEN: Multiple specs with different statuses
      await workflowService.createSpec({
        title: 'Spec 1',
        domain: 'posts',
        filePath: 'specs/posts/spec1.md',
        status: 'pending',
        scenarioCount: 1,
      });

      await workflowService.createSpec({
        title: 'Spec 2',
        domain: 'posts',
        filePath: 'specs/posts/spec2.md',
        status: 'pending',
        scenarioCount: 1,
      });

      await workflowService.createSpec({
        title: 'Spec 3',
        domain: 'users',
        filePath: 'specs/users/spec3.md',
        status: 'in-progress',
        scenarioCount: 1,
      });

      // WHEN: I get specs grouped by status
      const grouped = await workflowService.getSpecsByStatus();

      // THEN: Specs should be properly organized
      expect(grouped.pending).toHaveLength(2);
      expect(grouped['in-progress']).toHaveLength(1);
      expect(grouped.completed).toHaveLength(0);
    });
  });

  describe('Scenario: Drag Spec Card Between Stages (Unit Tests)', () => {
    it('should update spec status in database', async () => {
      // GIVEN: A spec with status "pending"
      const spec = await workflowService.createSpec({
        title: 'Create Post',
        domain: 'posts',
        filePath: 'specs/posts/create-post.md',
        status: 'pending',
        scenarioCount: 3,
      });

      // WHEN: I update the spec status to "in-progress"
      const updated = await workflowService.updateSpecStatus(spec.id, 'in-progress');

      // THEN: The spec status should be updated
      expect(updated).toMatchObject({
        id: spec.id,
        status: 'in-progress',
        title: 'Create Post',
      });
      expect(updated.updatedAt.getTime()).toBeGreaterThan(spec.updatedAt.getTime());
    });

    it('should retrieve updated spec with new status', async () => {
      // GIVEN: A spec that was updated
      const spec = await workflowService.createSpec({
        title: 'Create Post',
        domain: 'posts',
        filePath: 'specs/posts/create-post.md',
        status: 'pending',
        scenarioCount: 3,
      });

      await workflowService.updateSpecStatus(spec.id, 'in-progress');

      // WHEN: I retrieve the spec by ID
      const retrieved = await workflowService.getSpecById(spec.id);

      // THEN: It should have the new status
      expect(retrieved).toBeDefined();
      expect(retrieved?.status).toBe('in-progress');
    });
  });

  describe('Scenario: View Spec Details from Card (Unit Tests)', () => {
    it('should retrieve full spec details including content', async () => {
      // GIVEN: A spec with content in the database
      const spec = await workflowService.createSpec({
        title: 'Archive Posts',
        domain: 'posts',
        filePath: 'specs/posts/archive-posts.md',
        status: 'in-progress',
        scenarioCount: 5,
        content: '# Archive Posts\n\nThis is the spec content...',
      });

      // WHEN: I retrieve the spec by ID
      const retrieved = await workflowService.getSpecById(spec.id);

      // THEN: I should get all spec details including content
      expect(retrieved).toMatchObject({
        id: spec.id,
        title: 'Archive Posts',
        domain: 'posts',
        status: 'in-progress',
        scenarioCount: 5,
        content: '# Archive Posts\n\nThis is the spec content...',
      });
      expect(retrieved?.createdAt).toBeDefined();
      expect(retrieved?.updatedAt).toBeDefined();
    });
  });

  describe('Scenario: Prevent Invalid Status Transitions (Unit Tests)', () => {
    it('should prevent moving completed spec back to pending', async () => {
      // GIVEN: A spec with status "completed"
      const spec = await workflowService.createSpec({
        title: 'User Profile',
        domain: 'users',
        filePath: 'specs/users/user-profile.md',
        status: 'completed',
        scenarioCount: 4,
      });

      // WHEN: I try to update the spec status to "pending"
      // THEN: It should throw an error
      await expect(workflowService.updateSpecStatus(spec.id, 'pending')).rejects.toThrow(
        'Cannot move completed specs back to pending',
      );
    });

    it('should allow valid status transitions', async () => {
      // GIVEN: A spec with status "pending"
      const spec = await workflowService.createSpec({
        title: 'Create Post',
        domain: 'posts',
        filePath: 'specs/posts/create-post.md',
        status: 'pending',
        scenarioCount: 3,
      });

      // WHEN: I update the spec through valid transitions
      const toInProgress = await workflowService.updateSpecStatus(spec.id, 'in-progress');
      expect(toInProgress.status).toBe('in-progress');

      const toCompleted = await workflowService.updateSpecStatus(spec.id, 'completed');
      expect(toCompleted.status).toBe('completed');

      // THEN: Both transitions should succeed
      expect(toCompleted).toBeDefined();
    });
  });
});
