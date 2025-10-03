# Implementation Plan: Spec Kanban Board

## Specification

`specs/workflow/spec-kanban-board.md`

## Test Strategy

### Scenario: View Specs Organized by Workflow Stage

- **Test Type**: API + Unit
- **Rationale**: Database queries and data fetching logic are best tested at the API integration level to ensure proper data transformation and filtering. Business logic for parsing spec files can be unit tested.
- **Test Location**:
  - `modules/workflow/tests/integration/workflow.api.test.ts` (API test)
  - `modules/workflow/tests/unit/spec-parser.test.ts` (Unit test for markdown parsing)

### Scenario: Drag Spec Card Between Stages

- **Test Type**: API + Unit
- **Rationale**: Status updates are database operations best validated through API tests. The business logic for status transition validation can be unit tested separately.
- **Test Location**:
  - `modules/workflow/tests/integration/workflow-status.api.test.ts` (API test)
  - `modules/workflow/tests/unit/workflow.service.test.ts` (Unit test for validation logic)

### Scenario: Create New Spec from Kanban Board

- **Test Type**: API + Unit
- **Rationale**: Creating files and database records requires API integration testing. Template generation and file creation logic can be unit tested.
- **Test Location**:
  - `modules/workflow/tests/integration/spec-creation.api.test.ts` (API test)
  - `modules/workflow/tests/unit/spec-generator.test.ts` (Unit test for template logic)

### Scenario: View Spec Details from Card

- **Test Type**: API + Unit
- **Rationale**: Reading file contents and fetching metadata involves filesystem and database operations, best tested through API integration tests.
- **Test Location**:
  - `modules/workflow/tests/integration/spec-details.api.test.ts` (API test)

### Scenario: Sync Specs from Filesystem

- **Test Type**: Unit
- **Rationale**: Filesystem scanning and metadata extraction is pure business logic without HTTP contracts, ideal for fast unit tests.
- **Test Location**:
  - `modules/workflow/tests/unit/spec-sync.service.test.ts` (Unit test)

### Scenario: Handle Empty Workflow Stages

- **Test Type**: API
- **Rationale**: Testing empty result sets from database queries is most effective at the API level.
- **Test Location**:
  - `modules/workflow/tests/integration/workflow.api.test.ts` (API test - add to existing)

### Scenario: Prevent Invalid Status Transitions

- **Test Type**: Unit
- **Rationale**: Business rule validation is pure logic, perfect for fast unit tests without needing database or HTTP infrastructure.
- **Test Location**:
  - `modules/workflow/tests/unit/workflow.service.test.ts` (Unit test - add to existing)

## Files to Create

### Schema

- `modules/workflow/schema.ts`
  - Tables: `specs` (id, filePath, domain, title, status, scenarioCount, createdAt, updatedAt)
  - Purpose: Track spec files and their workflow status

### Types

- `modules/workflow/types.ts`
  - Types: `Spec`, `SpecStatus`, `CreateSpecInput`, `UpdateSpecInput`, `SpecFilters`, `SpecMetadata`
  - Purpose: Type definitions for workflow domain

### Services

- `modules/workflow/services/workflow.service.ts`
  - Methods: `getSpecs()`, `getSpecById()`, `updateSpecStatus()`, `createSpec()`, `getSpecContent()`
  - Purpose: Core business logic for managing specs

- `modules/workflow/services/spec-sync.service.ts`
  - Methods: `syncSpecsFromFilesystem()`, `parseSpecMetadata()`, `scanSpecsDirectory()`
  - Purpose: Filesystem operations and metadata extraction

- `modules/workflow/services/spec-generator.service.ts`
  - Methods: `generateSpecFile()`, `getSpecTemplate()`
  - Purpose: Generate new spec files from templates

### API Routes

- `app/api/workflow/specs/route.ts`
  - Endpoints: GET (list specs), POST (create spec)
  - Purpose: Main CRUD operations for specs

- `app/api/workflow/specs/[id]/route.ts`
  - Endpoints: GET (get single spec), PUT (update spec status)
  - Purpose: Individual spec operations

- `app/api/workflow/specs/[id]/content/route.ts`
  - Endpoints: GET (get spec markdown content)
  - Purpose: Retrieve full spec file content

- `app/api/workflow/sync/route.ts`
  - Endpoints: POST (trigger filesystem sync)
  - Purpose: Sync specs from filesystem to database

### Frontend Components

- `app/(main)/workflow/page.tsx`
  - Purpose: Main Kanban board page

- `app/(main)/workflow/components/kanban-board.tsx`
  - Purpose: Kanban board container with columns

- `app/(main)/workflow/components/kanban-column.tsx`
  - Purpose: Single column component (Pending/In Progress/Completed)

- `app/(main)/workflow/components/spec-card.tsx`
  - Purpose: Individual spec card with drag-and-drop

- `app/(main)/workflow/components/spec-details-panel.tsx`
  - Purpose: Slide-out panel for viewing spec details

- `app/(main)/workflow/components/create-spec-dialog.tsx`
  - Purpose: Dialog for creating new specs

### Tests

- `modules/workflow/tests/unit/workflow.service.test.ts`
  - Tests: Status transition validation, business rules

- `modules/workflow/tests/unit/spec-parser.test.ts`
  - Tests: Markdown parsing, metadata extraction

- `modules/workflow/tests/unit/spec-generator.test.ts`
  - Tests: Template generation, file path creation

- `modules/workflow/tests/unit/spec-sync.service.test.ts`
  - Tests: Filesystem scanning, sync logic

- `modules/workflow/tests/integration/workflow.api.test.ts`
  - Tests: List specs, filter by status, empty results

- `modules/workflow/tests/integration/workflow-status.api.test.ts`
  - Tests: Update spec status via API

- `modules/workflow/tests/integration/spec-creation.api.test.ts`
  - Tests: Create spec via API, file creation

- `modules/workflow/tests/integration/spec-details.api.test.ts`
  - Tests: Fetch spec content, metadata

## Files to Modify

- `lib/db/schema.ts` - Add workflow schema export
- `lib/container/types.ts` - Register WorkflowService, SpecSyncService, SpecGeneratorService
- `lib/container/index.ts` - Instantiate workflow services
- `app/(main)/layout.tsx` - Add navigation link to /workflow page (if needed)

## Database Changes

**Schema Additions:**

```typescript
// modules/workflow/schema.ts
export const specs = pgTable('specs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  filePath: text('file_path').notNull().unique(), // e.g., "specs/posts/create-post.md"
  domain: text('domain').notNull(), // e.g., "posts"
  title: text('title').notNull(), // e.g., "Create Post"
  status: text('status').notNull().default('pending'), // pending | in-progress | completed
  scenarioCount: integer('scenario_count').notNull().default(0),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
});
```

**Migration Commands:**
```bash
npm run db:generate  # Generate migration
npm run db:migrate   # Apply migration
```

## Prerequisites

- [x] PostgreSQL database configured (already exists)
- [x] Drizzle ORM setup (already exists)
- [x] Better-auth authentication (already exists)
- [x] shadcn/ui components (already exists)
- [ ] Install @dnd-kit libraries for drag-and-drop
  ```bash
  npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
  ```
- [ ] Create specs/ directory structure if not exists

## Implementation Order

### 1. Database Layer
- Create `modules/workflow/schema.ts`
- Update `lib/db/schema.ts` to export workflow schema
- Run `npm run db:generate && npm run db:migrate`

### 2. Types & Service Layer (with Unit Tests)
- Create `modules/workflow/types.ts`
- Create `modules/workflow/services/workflow.service.ts` with unit tests
- Create `modules/workflow/services/spec-sync.service.ts` with unit tests
- Create `modules/workflow/services/spec-generator.service.ts` with unit tests
- Update dependency injection container

### 3. API Layer (with Integration Tests)
- Create `app/api/workflow/specs/route.ts` with API tests
- Create `app/api/workflow/specs/[id]/route.ts` with API tests
- Create `app/api/workflow/specs/[id]/content/route.ts` with API tests
- Create `app/api/workflow/sync/route.ts` with API tests

### 4. Frontend Layer
- Install @dnd-kit dependencies
- Create Kanban board page: `app/(main)/workflow/page.tsx`
- Create reusable components:
  - `kanban-board.tsx`
  - `kanban-column.tsx`
  - `spec-card.tsx` (with drag-and-drop)
  - `spec-details-panel.tsx` (Sheet component)
  - `create-spec-dialog.tsx` (Dialog component)

### 5. Integration & Testing
- Run full test suite (`npm test`)
- Test drag-and-drop functionality manually
- Test filesystem sync with actual spec files
- Verify authentication protection on /workflow page

## Estimated Complexity

**Complex**

**Reasoning:**
- Multiple services with filesystem operations
- Database schema changes and migrations
- Complex frontend with drag-and-drop interaction
- 7 scenarios with mix of Unit and API tests
- File I/O operations for spec management
- Real-time status updates across database and filesystem
- 10+ test files covering unit and integration layers

**Estimated Test Count:** 25-30 tests
- Unit tests: ~15 (parsing, validation, sync logic, template generation)
- API integration tests: ~12 (CRUD operations, status updates, sync endpoint)
- E2E tests: 0 (not needed - UI interactions covered by component tests if desired)

---

_Ready to implement? Run: `/implement specs/workflow/spec-kanban-board.md`_
