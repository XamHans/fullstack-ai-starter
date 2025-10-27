# Groundwork: Onboarding Foundation

Built: 2025-10-27
Spec: `specs/households/create-household.md`, `specs/users/add-household-members.md`, `specs/users/capture-user-persona.md`, `specs/habits/define-personal-habits.md`

## Constitutional Compliance

### Simplicity Gate (Article I) ✅

- Simplest approach for current scenarios
- No future-proofing
- Minimal 6 files created/modified (3 schema, 3 services, 1 container, 1 types)

### Anti-Abstraction Gate (Article II) ✅

- Using Drizzle ORM directly
- Single representation per domain concept (schema-first)
- No unnecessary wrappers

### Groundwork Gate (Article IX) ✅

- 3 database tables for shared schema (`households`, `users`, `habits`)
- 4 specifications share this infrastructure
- Justified upfront setup for core entities.

## Prerequisites Established

### Core Capability: Database Persistence

- **Approach**: Drizzle ORM with PostgreSQL.
- **Library/Tool**: `drizzle-orm`, `postgres`
- **Why This Approach**: Leverages the existing project setup, ensures data integrity through relational constraints, and aligns with the "Framework Trust" principle (Article II).
- **What Works Now**: Database schemas for `households`, `users`, and `habits` are defined. Service shells for managing these entities are created and registered in the DI container.
- **What Scenarios Can Build**: All scenarios in the `create-household`, `add-household-members`, `capture-user-persona`, and `define-personal-habits` specifications can now be implemented.
- **Documentation**: [https://orm.drizzle.team/](https://orm.drizzle.team/)

## What Was Created

### Database Schema

- **Tables**: `households`, `users`, `habits`
- **Migrations**: Schema files created at `modules/{domain}/schema.ts`. Migrations can be generated with `pnpm db:generate`.
- **Rationale**: To model the core entities required for the user onboarding flow.

### Type Definitions

- **Files**: Types are inferred from schema files.
- **Types**: `Household`, `User`, `Habit` (inferred via Drizzle)
- **Rationale**: Single source of truth for data shapes, aligned with Anti-Abstraction principle.

### Service Shells

- **Files**:
  - `modules/households/services/household-service.ts`
  - `modules/users/services/user.service.ts` (updated)
  - `modules/habits/services/habit-service.ts`
- **Methods**:
  - `HouseholdService.createHousehold(...)`
  - `UserService.addMember(...)`
  - `UserService.savePersona(...)`
  - `HabitService.defineHabits(...)`
- **Rationale**: To provide a consistent interface for business logic related to the core entities. Shells are empty and ready for implementation.

### Test Infrastructure

- No new test infrastructure was created.

## What's NOT Included

- ❌ No scenario-specific logic
- ❌ No business logic in services (empty shells only)
- ❌ No API routes yet
- ❌ No UI components yet
- ❌ No scenario tests yet

## Complexity Tracking

✅ No constitutional exceptions required

## Next Steps

1. Review this groundwork
2. Run `/clear` to reset context (recommended)
3. Start implementing scenarios:
   - `/implement specs/households/create-household.md --scenario 1`
   - Or generate tasks first: `/create-tasks specs/households/create-household.md`
