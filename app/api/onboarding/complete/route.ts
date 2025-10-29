// POST /api/onboarding/complete - Complete onboarding for new household
import type { NextRequest } from 'next/server';
import {
  ApiError,
  parseRequestBody,
  validateRequiredFields,
  withErrorHandling,
} from '@/lib/api/base';
import { withServices } from '@/lib/container/utils';
import { summarizeWithAI } from '@/modules/onboarding/services/ai-summarization.service';

interface OnboardingMember {
  name: string;
  dietaryPreferences: string;
  personaBackground?: string;
  inspirationPrompt?: string;
}

interface OnboardingRequest {
  householdName: string;
  members: OnboardingMember[];
}

export const POST = withErrorHandling(async (request: NextRequest, context, logger) => {
  const { householdService, userService } = withServices('householdService', 'userService');

  logger?.info('Starting onboarding completion', {
    operation: 'completeOnboarding',
  });

  // Parse and validate request body
  const body = await parseRequestBody<OnboardingRequest>(request);
  validateRequiredFields(body, ['householdName', 'members']);

  if (!Array.isArray(body.members) || body.members.length === 0) {
    throw new ApiError(400, 'At least one member is required', 'MISSING_MEMBERS');
  }

  // Validate each member has required fields
  for (const member of body.members) {
    if (!member.name || !member.dietaryPreferences) {
      throw new ApiError(
        400,
        'Each member must have a name and dietary preferences',
        'INVALID_MEMBER_DATA',
      );
    }
  }

  try {
    // Step 1: Create household
    logger?.info('Creating household', {
      operation: 'completeOnboarding',
      householdName: body.householdName,
    });

    const household = await householdService.createHousehold(body.householdName);

    logger?.info('Household created', {
      operation: 'completeOnboarding',
      householdId: household.id,
    });

    // Step 2: Process each member with AI summarization
    const memberResults = [];

    for (const member of body.members) {
      logger?.info('Processing member', {
        operation: 'completeOnboarding',
        memberName: member.name,
        householdId: household.id,
      });

      // Summarize dietary preferences with AI
      const dietSummaryResult = await summarizeWithAI({
        text: member.dietaryPreferences,
        type: 'diet',
      });

      // Summarize persona background with AI (if provided)
      let personaSummaryResult = null;
      if (member.personaBackground) {
        personaSummaryResult = await summarizeWithAI({
          text: member.personaBackground,
          type: 'persona',
        });
      }

      // Create household member with summaries
      const newMember = await userService.createHouseholdMember({
        householdId: household.id,
        name: member.name,
        dietarySummary: dietSummaryResult.summary,
        personaSummary: personaSummaryResult?.summary,
        inspirationPrompt: member.inspirationPrompt,
      });

      memberResults.push(newMember);

      logger?.info('Member created', {
        operation: 'completeOnboarding',
        memberId: newMember.id,
        memberName: newMember.name,
        householdId: household.id,
      });
    }

    logger?.info('Onboarding completed successfully', {
      operation: 'completeOnboarding',
      householdId: household.id,
      memberCount: memberResults.length,
    });

    return {
      householdId: household.id,
    };
  } catch (error) {
    logger?.error('Onboarding failed', {
      operation: 'completeOnboarding',
      error,
    });

    // Re-throw ApiErrors as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap other errors
    throw new ApiError(
      500,
      `Failed to complete onboarding: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'ONBOARDING_FAILED',
    );
  }
});
