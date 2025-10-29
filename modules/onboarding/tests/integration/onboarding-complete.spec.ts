// Specification: /specs/onboarding/create-household.md
// Scenario: Happy Path - Complete onboarding with household, members, and diet preferences

import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { households } from '@/modules/households/schema';
import { users } from '@/modules/users/schema';
import { createTestContainer } from '@/tests/utils/test-container';
import {
  cleanTestDatabase,
  getTestDb,
  setupTestDatabase,
  teardownTestDatabase,
} from '@/tests/utils/test-database';

// Mock the AI summarization service at the top level (hoisted)
vi.mock('@/modules/onboarding/services/ai-summarization.service', () => ({
  summarizeWithAI: vi.fn(),
}));

describe('Feature: Complete Onboarding for New Users', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  it('Scenario: Happy Path - Complete onboarding with household, members, and diet preferences', async () => {
    // GIVEN: A new user opens the app for the first time
    const testDb = getTestDb();
    const container = createTestContainer();

    // Import the AI service mock and configure it for this test
    const { summarizeWithAI } = await import(
      '@/modules/onboarding/services/ai-summarization.service'
    );

    vi.mocked(summarizeWithAI)
      .mockResolvedValueOnce({
        summary:
          '**Diet**: Follows a vegetarian diet with gluten-free restrictions for optimal health',
      })
      .mockResolvedValueOnce({
        summary:
          '**Profile**: Busy professional prioritizing healthy meal preparation and time-efficient cooking',
      })
      .mockResolvedValueOnce({
        summary:
          '**Diet**: Maintains a dairy-free lifestyle with preference for spicy, flavorful meals',
      })
      .mockResolvedValueOnce({
        summary:
          '**Profile**: Fitness enthusiast focused on meal tracking and nutritional optimization for muscle gains',
      });

    // WHEN: They complete the onboarding with household and members
    // Step 1: Create the household
    const household = await container.householdService.createHousehold('The Sanctuary');

    // Step 2: Create members with AI summarization
    const johannesDietarySummary = await summarizeWithAI({
      text: 'vegetarian, no gluten',
      type: 'diet',
    });
    const johannesPersonaSummary = await summarizeWithAI({
      text: 'Busy professional seeking healthy meal prep',
      type: 'persona',
    });

    const _johannes = await container.userService.createHouseholdMember({
      householdId: household.id,
      name: 'Johannes',
      dietarySummary: johannesDietarySummary.summary,
      personaSummary: johannesPersonaSummary.summary,
    });

    const emmaDietarySummary = await summarizeWithAI({
      text: 'dairy-free, loves spicy food',
      type: 'diet',
    });
    const emmaPersonaSummary = await summarizeWithAI({
      text: 'Fitness enthusiast, meal tracking for gains',
      type: 'persona',
    });

    const _emma = await container.userService.createHouseholdMember({
      householdId: household.id,
      name: 'Emma',
      dietarySummary: emmaDietarySummary.summary,
      personaSummary: emmaPersonaSummary.summary,
    });

    // THEN: A household named "The Sanctuary" should be created in the database
    const [createdHousehold] = await testDb
      .select()
      .from(households)
      .where(eq(households.id, household.id));

    expect(createdHousehold).toBeDefined();
    expect(createdHousehold.name).toBe('The Sanctuary');

    // THEN: Member "Johannes" should be stored with AI-summarized diet preferences and persona
    const householdMembers = await testDb
      .select()
      .from(users)
      .where(eq(users.householdId, household.id));

    expect(householdMembers).toHaveLength(2);

    const savedJohannes = householdMembers.find((m) => m.name === 'Johannes');
    expect(savedJohannes).toBeDefined();
    expect(savedJohannes?.dietarySummary).toBe(
      '**Diet**: Follows a vegetarian diet with gluten-free restrictions for optimal health',
    );
    expect(savedJohannes?.personaSummary).toBe(
      '**Profile**: Busy professional prioritizing healthy meal preparation and time-efficient cooking',
    );

    // THEN: Member "Emma" should be stored with AI-summarized diet preferences and persona
    const savedEmma = householdMembers.find((m) => m.name === 'Emma');
    expect(savedEmma).toBeDefined();
    expect(savedEmma?.dietarySummary).toBe(
      '**Diet**: Maintains a dairy-free lifestyle with preference for spicy, flavorful meals',
    );
    expect(savedEmma?.personaSummary).toBe(
      '**Profile**: Fitness enthusiast focused on meal tracking and nutritional optimization for muscle gains',
    );

    // THEN: The diet preferences should be available for future meal planning
    expect(savedJohannes?.dietarySummary).toContain('vegetarian');
    expect(savedJohannes?.dietarySummary).toContain('gluten-free');
    expect(savedEmma?.dietarySummary).toContain('dairy-free');
    expect(savedEmma?.dietarySummary).toContain('spicy');

    // Verify AI service was called with correct parameters
    expect(summarizeWithAI).toHaveBeenCalledTimes(4);
    expect(summarizeWithAI).toHaveBeenCalledWith({
      text: 'vegetarian, no gluten',
      type: 'diet',
    });
    expect(summarizeWithAI).toHaveBeenCalledWith({
      text: 'Busy professional seeking healthy meal prep',
      type: 'persona',
    });
    expect(summarizeWithAI).toHaveBeenCalledWith({
      text: 'dairy-free, loves spicy food',
      type: 'diet',
    });
    expect(summarizeWithAI).toHaveBeenCalledWith({
      text: 'Fitness enthusiast, meal tracking for gains',
      type: 'persona',
    });
  });
});
