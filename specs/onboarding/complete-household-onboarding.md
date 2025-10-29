# Complete Household Onboarding

## Context

This feature provides a streamlined onboarding flow for new users to set up their household on a single tablet device. Users create a household, add multiple members (without authentication or invitation links), define dietary preferences and persona background for each member, and store all data in the database for future meal planning suggestions. This is the MVP foundation for testing diet tracking and meal planning features.

## Domain

`modules/onboarding/`

## Implementation Progress

✅ **Scenario 1 completed** - Happy Path: Complete onboarding with household, members, and diet preferences
- Branch: `feature/onboarding/complete-household-onboarding/complete-onboarding-with-members`
- Date: 2025-10-29
- Implemented: API route, services, AI summarization, multi-step wizard UI, integration tests

⏳ Remaining scenarios: 7 pending (Scenarios 2-8)

## Uncertainties

✅ **No ambiguities - all requirements are clear and testable**

### Resolved Clarifications

The following requirements have been clarified:

- ✅ **Authentication**: None required (MVP for testing)
- ✅ **Member addition**: Same tablet, no invitation links, simple flow
- ✅ **Member limits**: Maximum 5 members per household
- ✅ **Name validation**: No empty names (household and member names required)
- ✅ **Household name length**: No minimum length, just cannot be empty
- ✅ **Member requirement**: At least 1 member required before completing onboarding
- ✅ **Avatar requirement**: Optional (no upload needed for MVP)
- ✅ **Habit definition**: Optional during onboarding (can skip, add later)
- ✅ **Diet preferences**: Required - free text input with AI summarization (essential for meal planning)
- ✅ **Persona background**: Optional - free text input with AI summarization
- ✅ **Inspiration prompt**: Optional, no length limits
- ✅ **AI failure handling**: Show error message only, allow retry
- ✅ **Mid-session progress**: No progress saving - users start over if they close the app (keep it simple)

## Scenarios

### Scenario 1: Happy Path: Complete onboarding with household, members, and diet preferences
**Status**: ✅ Completed | **Branch**: `feature/onboarding/complete-household-onboarding/complete-onboarding-with-members` | **Date**: 2025-10-29

```gherkin
Given a new user opens the app for the first time
When they enter household name "The Sanctuary"
And they add member "Johannes" with dietary preferences "vegetarian, no gluten"
And they add persona background for Johannes "Busy professional seeking healthy meal prep"
And they add member "Emma" with dietary preferences "dairy-free, loves spicy food"
And they add persona background for Emma "Fitness enthusiast, meal tracking for gains"
And they complete the onboarding
Then a household named "The Sanctuary" should be created in the database
And member "Johannes" should be stored with AI-summarized diet preferences
And member "Johannes" should have AI-summarized persona background
And member "Emma" should be stored with AI-summarized diet preferences
And member "Emma" should have AI-summarized persona background
And the diet preferences should be available for future meal planning
And the user should be taken to the main app dashboard
```

### Happy Path: Add member with optional habits during onboarding

```gherkin
Given a user is onboarding their household "The Sanctuary"
When they add member "Sarah"
And they define dietary preferences "pescatarian, no shellfish"
And they define habits "Morning meditation", "Drink green juice", "Evening yoga"
Then member "Sarah" should be created with 3 habits
And the habits should be stored in display order
And Sarah's diet preferences should be AI-summarized and stored
```

### Edge Case: Create household with no name

```gherkin
Given a user is starting onboarding
When they try to proceed without entering a household name
Then they should see error "Household name is required"
And they should remain on the household creation screen
```

### Edge Case: Add member with no name

```gherkin
Given a user has created household "The Sanctuary"
And they are adding a new member
When they try to proceed without entering a member name
Then they should see error "Member name is required"
And the member should not be added
```

### Edge Case: Exceed maximum member limit

```gherkin
Given a household "The Sanctuary" already has 5 members
When a user tries to add a 6th member
Then they should see error "Maximum 5 members allowed per household"
And the member should not be added
```

### Edge Case: AI summarization fails for diet preferences

```gherkin
Given a user is adding member "Johannes" with dietary preferences "vegetarian, no gluten"
When the AI service fails to generate a diet summary
Then they should see error "Could not process dietary preferences, please try again"
And they should be able to retry the summarization
And they should not be able to proceed until summarization succeeds
```

### Edge Case: AI summarization fails for persona background

```gherkin
Given a user is adding member "Emma" with persona background "Busy professional"
When the AI service fails to generate a persona summary
Then they should see error "Could not process persona information, please try again"
And they should be able to retry the summarization
And they should not be able to proceed until summarization succeeds
```

### Edge Case: Try to complete onboarding without any members

```gherkin
Given a user has created household "The Sanctuary"
And they have not added any members
When they try to complete the onboarding
Then they should see error "At least one member is required"
And they should remain on the member addition screen
```

### Edge Case: Try to add member without dietary preferences

```gherkin
Given a user is adding member "Johannes"
When they try to proceed without entering dietary preferences
Then they should see error "Dietary preferences are required"
And the member should not be added
```

## Specification Quality Checklist

Before moving to /groundwork or /implement, verify:

### Requirement Completeness (Article VI)

- [x] All `[NEEDS CLARIFICATION]` markers are resolved
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Each scenario has clear pass/fail conditions

### What vs. How Separation (Article VI.2)

- [x] Spec focuses on WHAT users need and WHY
- [x] No implementation details (tech stack, APIs, code structure)
- [x] No prescriptive HOW (e.g., "use Redis", "create service class")
- [x] Behaviors are described, not solutions

### Scenario Quality (Article VI.3)

- [x] Each scenario is independently testable
- [x] Scenarios are precise (no ambiguous terms - except marked clarifications)
- [x] Scenarios are minimal (no unnecessary complexity)
- [x] Happy path + key edge cases covered (2-7 scenarios)

### YAGNI Compliance (Article I.2)

- [x] No speculative or "might need" features
- [x] No future-proofing scenarios
- [x] Only solving current, real problems (MVP testing)

## Dependencies

- **AI Service**: External AI service (e.g., OpenAI, Anthropic) for diet/persona summarization
- **Existing Groundwork**: `modules/onboarding/GROUNDWORK-onboarding.md` has established:
  - Database schemas: `households`, `users`, `habits`
  - Service shells: `HouseholdService`, `UserService`, `HabitService`
  - Drizzle ORM setup

## Notes

- **No authentication**: This is an intentional MVP choice for testing. Users share a single tablet.
- **No invitation links**: All members are added directly on the same device during onboarding.
- **AI summarization**: Diet and persona text are summarized via AI for structured storage, enabling better meal planning suggestions.
- **Diet preferences required**: Dietary preferences are mandatory for each member (essential for meal planning).
- **Habits optional**: Users can skip defining habits during onboarding and add them later.
- **Persona optional**: Persona background is optional during member creation.
- **No progress saving**: Onboarding is a single session - closing the app resets progress (keeping it simple for MVP).
- **AI retry on failure**: Users must retry AI summarization if it fails - no fallback to raw text.

## Complexity Tracking

### Exception: AI Service Integration

- **Principle Violated**: Article III.2 (Contract Tests Mandatory)
- **Justification**: External AI service (OpenAI/Anthropic) requires API integration. Contract tests will define request/response shapes and error handling before implementation.
- **Impact**: +1 external dependency, API contract definition required
- **Alternatives Considered**:
  - **No summarization**: Store raw text → Less structured data, harder to query for meal planning
  - **Manual rules-based summarization**: Complex parsing logic → Higher maintenance burden
- **Mitigation**: Define clear contracts for AI service calls, implement retry mechanism on failure (no raw text fallback)

## Production Learnings

<!-- This section will be updated after deployment with real-world insights -->

---

_Generated: 2025-10-28_

_Consolidates: `specs/households/create-household.md`, `specs/users/add-household-members.md`, `specs/users/capture-user-persona.md`, `specs/habits/define-personal-habits.md`_

_Next step: All requirements finalized! Run `/implement specs/onboarding/complete-household-onboarding.md` to begin implementation_
