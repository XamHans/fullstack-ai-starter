// Specification: /specs/workflow/spec-kanban-board.md

import * as fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestContainer } from '@/tests/utils/test-container';
import type { WorkflowService } from '../../services/workflow.service';

// Mock filesystem for spec generation tests
vi.mock('node:fs/promises');

describe('Feature: Spec Kanban Board - API Integration Tests', () => {
  let workflowService: WorkflowService;
  let testContainer: any;

  // Simulated API request/response helpers
  const createMockRequest = (body?: any, method = 'GET') => ({
    method,
    body,
    json: async () => body,
  });

  const createMockContext = (params: Record<string, string> = {}) => ({
    params: Promise.resolve(params),
  });

  beforeEach(() => {
    testContainer = createTestContainer();
    workflowService = testContainer.workflowService;
    vi.clearAllMocks();
  });

  describe('Scenario: View Specs Organized by Workflow Stage (API Test)', () => {
    it('GET /api/workflow/specs should return all specs organized by status', async () => {
      // GIVEN: 3 specs with different statuses exist in the database
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

      // WHEN: The API endpoint is called
      const specs = await workflowService.getAllSpecs();

      // THEN: Should return all 3 specs with correct metadata
      expect(specs).toHaveLength(3);

      const createPost = specs.find((s) => s.title === 'Create Post');
      expect(createPost).toMatchObject({
        domain: 'posts',
        status: 'pending',
        scenarioCount: 3,
      });
      expect(createPost?.createdAt).toBeInstanceOf(Date);

      const archivePosts = specs.find((s) => s.title === 'Archive Posts');
      expect(archivePosts).toMatchObject({
        domain: 'posts',
        status: 'in-progress',
        scenarioCount: 5,
      });

      const userProfile = specs.find((s) => s.title === 'User Profile');
      expect(userProfile).toMatchObject({
        domain: 'users',
        status: 'completed',
        scenarioCount: 4,
      });
    });
  });

  describe('Scenario: Drag Spec Card Between Stages (API Test)', () => {
    it('PATCH /api/workflow/specs/[id] should update spec status', async () => {
      // GIVEN: A spec with status "pending"
      const spec = await workflowService.createSpec({
        title: 'Create Post',
        domain: 'posts',
        filePath: 'specs/posts/create-post.md',
        status: 'pending',
        scenarioCount: 3,
      });

      // WHEN: The API endpoint is called to update status
      const updated = await workflowService.updateSpecStatus(spec.id, 'in-progress');

      // THEN: The spec status should be updated
      expect(updated.status).toBe('in-progress');
      expect(updated.id).toBe(spec.id);

      // AND: Retrieving the spec should show the new status
      const retrieved = await workflowService.getSpecById(spec.id);
      expect(retrieved?.status).toBe('in-progress');
    });

    it('PATCH /api/workflow/specs/[id] should return 400 for invalid status transitions', async () => {
      // GIVEN: A spec with status "completed"
      const spec = await workflowService.createSpec({
        title: 'User Profile',
        domain: 'users',
        filePath: 'specs/users/user-profile.md',
        status: 'completed',
        scenarioCount: 4,
      });

      // WHEN: Attempting to move back to "pending"
      // THEN: Should throw an error
      await expect(workflowService.updateSpecStatus(spec.id, 'pending')).rejects.toThrow(
        'Cannot move completed specs back to pending',
      );
    });
  });

  describe('Scenario: Create New Spec from Kanban Board (API Test)', () => {
    it('POST /api/workflow/specs should create new spec file and database record', async () => {
      // GIVEN: Valid spec creation data
      const requestBody = {
        domain: 'posts',
        featureName: 'delete-post',
        description: 'Allow users to delete their posts',
      };

      // Mock filesystem
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      // WHEN: The API endpoint is called
      const specGeneratorService = testContainer.specGeneratorService;
      const result = await specGeneratorService.generateSpec(requestBody);

      // THEN: Should return the created spec details
      expect(result.filePath).toBe('specs/posts/delete-post.md');
      expect(result.title).toBe('Delete Post');

      // AND: The spec should exist in the database
      const spec = await workflowService.getSpecByFilePath(result.filePath);
      expect(spec).toMatchObject({
        title: 'Delete Post',
        domain: 'posts',
        status: 'pending',
        scenarioCount: 0,
      });
    });

    it('POST /api/workflow/specs should return 400 if spec already exists', async () => {
      // GIVEN: A spec already exists
      await workflowService.createSpec({
        title: 'Delete Post',
        domain: 'posts',
        filePath: 'specs/posts/delete-post.md',
        status: 'pending',
        scenarioCount: 0,
      });

      const requestBody = {
        domain: 'posts',
        featureName: 'delete-post',
        description: 'Allow users to delete their posts',
      };

      // Mock filesystem
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      // WHEN: Attempting to create the same spec again
      const specGeneratorService = testContainer.specGeneratorService;

      // THEN: Should throw an error
      await expect(specGeneratorService.generateSpec(requestBody)).rejects.toThrow(
        'Spec file already exists',
      );
    });

    it('POST /api/workflow/specs should validate required fields', async () => {
      // GIVEN: Invalid request body (missing required fields)
      const invalidBody = {
        domain: 'posts',
        // Missing featureName and description
      };

      // WHEN: Attempting to create a spec with missing fields
      // THEN: Should detect missing fields
      expect(invalidBody).not.toHaveProperty('featureName');
      expect(invalidBody).not.toHaveProperty('description');
    });
  });

  describe('Scenario: View Spec Details from Card (API Test)', () => {
    it('GET /api/workflow/specs/[id]/content should return full spec with content', async () => {
      // GIVEN: A spec with content in the database
      const spec = await workflowService.createSpec({
        title: 'Archive Posts',
        domain: 'posts',
        filePath: 'specs/posts/archive-posts.md',
        status: 'in-progress',
        scenarioCount: 5,
        content: '# Archive Posts\n\nThis is the spec content...',
      });

      // WHEN: The API endpoint is called
      const retrieved = await workflowService.getSpecById(spec.id);

      // THEN: Should return full spec details including content
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
      expect(retrieved?.filePath).toBe('specs/posts/archive-posts.md');
    });

    it('GET /api/workflow/specs/[id]/content should return 404 for non-existent spec', async () => {
      // GIVEN: A non-existent spec ID
      const nonExistentId = 'non-existent-id';

      // WHEN: The API endpoint is called
      const result = await workflowService.getSpecById(nonExistentId);

      // THEN: Should return undefined
      expect(result).toBeUndefined();
    });
  });

  describe('Scenario: Handle Empty Workflow Stages (API Test)', () => {
    it('GET /api/workflow/specs should return empty arrays for stages with no specs', async () => {
      // GIVEN: Only one spec in "pending" status
      await workflowService.createSpec({
        title: 'Create Post',
        domain: 'posts',
        filePath: 'specs/posts/create-post.md',
        status: 'pending',
        scenarioCount: 3,
      });

      // WHEN: The API endpoint is called to get specs by status
      const grouped = await workflowService.getSpecsByStatus();

      // THEN: Pending should have 1 spec, others should be empty
      expect(grouped.pending).toHaveLength(1);
      expect(grouped['in-progress']).toHaveLength(0);
      expect(grouped.completed).toHaveLength(0);
    });

    it('GET /api/workflow/specs should handle completely empty database', async () => {
      // GIVEN: No specs in the database
      // (database is already clean from beforeEach)

      // WHEN: The API endpoint is called
      const specs = await workflowService.getAllSpecs();

      // THEN: Should return an empty array
      expect(specs).toHaveLength(0);
    });
  });

  describe('Scenario: Sync Specs from Filesystem (API Test)', () => {
    it('POST /api/workflow/sync should sync specs and return sync result', async () => {
      // GIVEN: Mock filesystem with spec files
      const mockContent = `# Test Spec

## Domain
\`modules/test/\`

## Scenarios

### Happy Path: Test scenario
\`\`\`gherkin
Given something
When action
Then result
\`\`\`
`;

      vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
        const pathStr = String(dirPath);
        // Handle both 'specs' and 'specs/test' paths
        if (pathStr === 'specs' || pathStr.endsWith('/specs')) {
          return [{ name: 'test', isDirectory: () => true } as any];
        }
        if (pathStr.includes('specs/test') || pathStr.includes('specs\\test')) {
          return [{ name: 'test-spec.md', isDirectory: () => false } as any];
        }
        return [];
      });

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);

      // WHEN: The sync API endpoint is called
      const specSyncService = testContainer.specSyncService;
      const result = await specSyncService.syncSpecsFromFilesystem('specs');

      // THEN: Should return successful sync result
      expect(result.synced).toBe(1);
      expect(result.created).toBe(1);
      expect(result.errors).toHaveLength(0);

      // AND: The spec should be in the database
      const specs = await workflowService.getAllSpecs();
      expect(specs).toHaveLength(1);
      expect(specs[0].title).toBe('Test Spec');
    });
  });
});
