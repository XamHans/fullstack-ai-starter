import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestContainer } from '@/tests/utils/test-container';
import {
  cleanTestDatabase,
  setupTestDatabase,
  teardownTestDatabase,
} from '@/tests/utils/test-database';
import type { UserService } from '../services/user.service';

describe('UserService', () => {
  let userService: UserService;
  let testContainer: ReturnType<typeof createTestContainer>;

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
    // Use the flattened container structure
    userService = testContainer.userService;
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
        provider: 'google',
        providerId: '123456',
      };

      const user = await userService.createUser(userData);

      expect(user).toMatchObject({
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
      });
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should find user by email', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        provider: 'google',
        providerId: '123456',
      };

      await userService.createUser(userData);
      const foundUser = await userService.getUserByEmail('test@example.com');

      expect(foundUser).toMatchObject({
        email: userData.email,
        name: userData.name,
      });
    });

    it('should return null for non-existent user', async () => {
      const foundUser = await userService.getUserByEmail('nonexistent@example.com');
      expect(foundUser).toBeUndefined();
    });
  });
});
