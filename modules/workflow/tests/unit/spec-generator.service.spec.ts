// Specification: /specs/workflow/spec-kanban-board.md

import * as fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestContainer } from '@/tests/utils/test-container';
import type { SpecGeneratorService } from '../../services/spec-generator.service';
import type { WorkflowService } from '../../services/workflow.service';

// Mock the filesystem
vi.mock('node:fs/promises');

describe('Feature: Spec Kanban Board - SpecGeneratorService', () => {
  let specGeneratorService: SpecGeneratorService;
  let workflowService: WorkflowService;
  let testContainer: any;

  beforeEach(() => {
    testContainer = createTestContainer();
    specGeneratorService = testContainer.specGeneratorService;
    workflowService = testContainer.workflowService;
    vi.clearAllMocks();
  });

  describe('Scenario: Create New Spec from Kanban Board (Unit Tests)', () => {
    it('should generate spec file with correct template structure', async () => {
      // GIVEN: Valid input for creating a new spec
      const input = {
        domain: 'posts',
        featureName: 'delete-post',
        description: 'Allow users to delete their posts',
      };

      // Mock filesystem operations
      let writtenContent = '';
      let writtenPath = '';
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockImplementation(async (path: any, content: any) => {
        writtenPath = String(path);
        writtenContent = String(content);
      });

      // WHEN: I generate a new spec
      const result = await specGeneratorService.generateSpec(input);

      // THEN: A spec file should be created with the correct structure
      expect(result.filePath).toBe('specs/posts/delete-post.md');
      expect(result.title).toBe('Delete Post');

      // AND: The file should have been written
      expect(writtenPath).toBe('specs/posts/delete-post.md');
      expect(writtenContent).toContain('# Delete Post');
      expect(writtenContent).toContain('## Context');
      expect(writtenContent).toContain('Allow users to delete their posts');
      expect(writtenContent).toContain('## Domain');
      expect(writtenContent).toContain('`modules/posts/`');
      expect(writtenContent).toContain('## Scenarios');
    });

    it('should create database record with pending status', async () => {
      // GIVEN: Valid input for creating a new spec
      const input = {
        domain: 'posts',
        featureName: 'delete-post',
        description: 'Allow users to delete their posts',
      };

      // Mock filesystem
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      // WHEN: I generate a new spec
      const result = await specGeneratorService.generateSpec(input);

      // THEN: A database record should be created
      const spec = await workflowService.getSpecByFilePath(result.filePath);
      expect(spec).toBeDefined();
      expect(spec).toMatchObject({
        title: 'Delete Post',
        domain: 'posts',
        filePath: 'specs/posts/delete-post.md',
        status: 'pending',
        scenarioCount: 0, // No scenarios yet
      });
    });

    it('should handle feature names with spaces and special characters', async () => {
      // GIVEN: Input with spaces and special characters
      const input = {
        domain: 'user-management',
        featureName: 'Reset User Password!',
        description: 'Allow users to reset their passwords',
      };

      // Mock filesystem
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      // WHEN: I generate a new spec
      const result = await specGeneratorService.generateSpec(input);

      // THEN: The file path should be properly formatted
      expect(result.filePath).toBe('specs/user-management/reset-user-password.md');
      expect(result.title).toBe('Reset User Password');
    });

    it('should create the domain directory if it does not exist', async () => {
      // GIVEN: A new domain that does not have a directory yet
      const input = {
        domain: 'new-domain',
        featureName: 'new-feature',
        description: 'A new feature in a new domain',
      };

      // Mock filesystem
      let createdDir = '';
      vi.mocked(fs.mkdir).mockImplementation(async (path: any) => {
        createdDir = String(path);
        return undefined;
      });
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      // WHEN: I generate a new spec
      await specGeneratorService.generateSpec(input);

      // THEN: The domain directory should be created
      expect(createdDir).toBe('specs/new-domain');
      expect(vi.mocked(fs.mkdir)).toHaveBeenCalledWith('specs/new-domain', { recursive: true });
    });

    it('should throw error if spec file already exists', async () => {
      // GIVEN: A spec already exists in the database
      await workflowService.createSpec({
        title: 'Delete Post',
        domain: 'posts',
        filePath: 'specs/posts/delete-post.md',
        status: 'pending',
        scenarioCount: 0,
      });

      const input = {
        domain: 'posts',
        featureName: 'delete-post',
        description: 'Allow users to delete their posts',
      };

      // WHEN: I try to generate the same spec again
      // THEN: It should throw an error
      await expect(specGeneratorService.generateSpec(input)).rejects.toThrow(
        'Spec file already exists',
      );
    });
  });
});
