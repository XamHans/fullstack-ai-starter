// Specification: /specs/workflow/spec-kanban-board.md

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestContainer } from '@/tests/utils/test-container';
import type { SpecSyncService } from '../../services/spec-sync.service';
import type { WorkflowService } from '../../services/workflow.service';

// Mock the filesystem
vi.mock('node:fs/promises');

describe('Feature: Spec Kanban Board - SpecSyncService', () => {
  let specSyncService: SpecSyncService;
  let workflowService: WorkflowService;
  let testContainer: any;

  beforeEach(() => {
    testContainer = createTestContainer();
    specSyncService = testContainer.specSyncService;
    workflowService = testContainer.workflowService;
    vi.clearAllMocks();
  });

  describe('Scenario: Sync Specs from Filesystem (Unit Tests)', () => {
    it('should scan specs directory recursively and create database records', async () => {
      // GIVEN: 2 spec files in the filesystem that are not in the database
      const mockFileContent1 = `# Create Post

## Context
Allow users to create new posts.

## Domain
\`modules/posts/\`

## Scenarios

### Happy Path: Create a new post
\`\`\`gherkin
Given I am logged in
When I create a post
Then I should see the post
\`\`\`

### Happy Path: Publish a post
\`\`\`gherkin
Given I have a draft post
When I publish it
Then it should be visible
\`\`\`
`;

      const mockFileContent2 = `# User Login

## Context
User authentication.

## Domain
\`modules/users/\`

## Scenarios

### Happy Path: Login with valid credentials
\`\`\`gherkin
Given I have valid credentials
When I log in
Then I should be authenticated
\`\`\`
`;

      // Mock filesystem to return our test files
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
        const pathStr = String(dirPath);
        if (pathStr.endsWith('specs')) {
          return [
            { name: 'posts', isDirectory: () => true } as any,
            { name: 'users', isDirectory: () => true } as any,
          ];
        }
        if (pathStr.endsWith('posts')) {
          return [{ name: 'create-post.md', isDirectory: () => false } as any];
        }
        if (pathStr.endsWith('users')) {
          return [{ name: 'user-login.md', isDirectory: () => false } as any];
        }
        return [];
      });

      vi.mocked(fs.readFile).mockImplementation(async (filePath: any) => {
        const pathStr = String(filePath);
        if (pathStr.includes('create-post.md')) {
          return mockFileContent1;
        }
        if (pathStr.includes('user-login.md')) {
          return mockFileContent2;
        }
        return '';
      });

      // WHEN: I trigger the filesystem sync
      const result = await specSyncService.syncSpecsFromFilesystem('specs');

      // THEN: Both specs should be created in the database
      expect(result.created).toBe(2);
      expect(result.synced).toBe(2);
      expect(result.errors).toHaveLength(0);

      // AND: The specs should be in the database with correct metadata
      const allSpecs = await workflowService.getAllSpecs();
      expect(allSpecs).toHaveLength(2);

      const createPostSpec = allSpecs.find((s) => s.title === 'Create Post');
      expect(createPostSpec).toMatchObject({
        domain: 'posts',
        status: 'pending',
        scenarioCount: 2, // Two scenarios in the spec
      });

      const userLoginSpec = allSpecs.find((s) => s.title === 'User Login');
      expect(userLoginSpec).toMatchObject({
        domain: 'users',
        status: 'pending',
        scenarioCount: 1, // One scenario in the spec
      });
    });

    it('should update existing specs if they already exist', async () => {
      // GIVEN: A spec already exists in the database
      await workflowService.createSpec({
        title: 'Create Post',
        domain: 'posts',
        filePath: 'specs/posts/create-post.md',
        status: 'in-progress',
        scenarioCount: 1, // Old count
      });

      const mockFileContent = `# Create Post - Updated

## Context
Updated content.

## Domain
\`modules/posts/\`

## Scenarios

### Happy Path: Create a new post
\`\`\`gherkin
Given I am logged in
When I create a post
Then I should see the post
\`\`\`

### Happy Path: Publish a post
\`\`\`gherkin
Given I have a draft post
When I publish it
Then it should be visible
\`\`\`

### Happy Path: Delete a post
\`\`\`gherkin
Given I have a post
When I delete it
Then it should be gone
\`\`\`
`;

      // Mock filesystem
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
        const pathStr = String(dirPath);
        if (pathStr.endsWith('specs')) {
          return [{ name: 'posts', isDirectory: () => true } as any];
        }
        if (pathStr.endsWith('posts')) {
          return [{ name: 'create-post.md', isDirectory: () => false } as any];
        }
        return [];
      });

      vi.mocked(fs.readFile).mockResolvedValue(mockFileContent);

      // WHEN: I sync the filesystem
      const result = await specSyncService.syncSpecsFromFilesystem('specs');

      // THEN: The spec should be updated, not created
      expect(result.updated).toBe(1);
      expect(result.created).toBe(0);
      expect(result.synced).toBe(1);

      // AND: The scenario count should be updated
      const allSpecs = await workflowService.getAllSpecs();
      expect(allSpecs).toHaveLength(1);
      expect(allSpecs[0]).toMatchObject({
        title: 'Create Post - Updated',
        scenarioCount: 3, // Updated count
        status: 'in-progress', // Status should not change during sync
      });
    });

    it('should extract metadata correctly from markdown files', async () => {
      // GIVEN: A markdown file with specific structure
      const mockContent = `# My Feature Title

## Context
Some context here.

## Domain
\`modules/inventory/\`

## Scenarios

### Happy Path: First scenario
\`\`\`gherkin
Given something
When something happens
Then result
\`\`\`

### Edge Case: Second scenario
\`\`\`gherkin
Given edge case
When triggered
Then handled
\`\`\`

### Edge Case: Third scenario
\`\`\`gherkin
Given another edge case
When triggered
Then handled
\`\`\`
`;

      vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
        const pathStr = String(dirPath);
        if (pathStr.endsWith('specs')) {
          return [{ name: 'inventory', isDirectory: () => true } as any];
        }
        if (pathStr.endsWith('inventory')) {
          return [{ name: 'my-feature.md', isDirectory: () => false } as any];
        }
        return [];
      });

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);

      // WHEN: I sync the filesystem
      await specSyncService.syncSpecsFromFilesystem('specs');

      // THEN: The metadata should be correctly extracted
      const allSpecs = await workflowService.getAllSpecs();
      expect(allSpecs).toHaveLength(1);
      expect(allSpecs[0]).toMatchObject({
        title: 'My Feature Title',
        domain: 'inventory',
        scenarioCount: 3,
      });
    });

    it('should be idempotent when run multiple times', async () => {
      // GIVEN: A spec file in the filesystem
      const mockContent = `# Test Spec

## Domain
\`modules/test/\`

## Scenarios

### Test scenario
\`\`\`gherkin
Given test
\`\`\`
`;

      vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
        const pathStr = String(dirPath);
        if (pathStr.endsWith('specs')) {
          return [{ name: 'test', isDirectory: () => true } as any];
        }
        if (pathStr.endsWith('test')) {
          return [{ name: 'test-spec.md', isDirectory: () => false } as any];
        }
        return [];
      });

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);

      // WHEN: I run sync multiple times
      const result1 = await specSyncService.syncSpecsFromFilesystem('specs');
      const result2 = await specSyncService.syncSpecsFromFilesystem('specs');
      const result3 = await specSyncService.syncSpecsFromFilesystem('specs');

      // THEN: First run should create, subsequent runs should update
      expect(result1.created).toBe(1);
      expect(result2.updated).toBe(1);
      expect(result3.updated).toBe(1);

      // AND: There should still be only one spec in the database
      const allSpecs = await workflowService.getAllSpecs();
      expect(allSpecs).toHaveLength(1);
    });
  });
});
