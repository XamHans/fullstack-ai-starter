# Spec Kanban Board

## Context
Visualize and track the BDD 3-phase workflow (Spec → Plan → Implement) using an interactive Kanban board. Display specification files as draggable cards organized by their workflow stage, enabling developers to see development progress at a glance and manage multiple feature specifications efficiently.

## Domain
`modules/workflow/`

## Implementation Progress
<!-- Track scenario implementation below -->
<!-- Updated: 2025-10-03 -->

### Backend Layer (Partially Complete)
✅ **Database Schema** - Created `specs` table with migrations (`modules/workflow/schema.ts`)
✅ **Types** - Defined all necessary types (`modules/workflow/types.ts`)
✅ **Services** - Implemented WorkflowService, SpecSyncService, SpecGeneratorService
✅ **Tests** - Unit and integration tests written for all services
✅ **Container** - Services registered in dependency injection (`lib/container/`)
✅ **Test Infrastructure** - Refactored to use real PostgreSQL with `test` schema (no mocks/Docker)

### API Layer (Not Started)
⏳ API routes pending implementation:
- `/api/workflow/specs` (GET, POST)
- `/api/workflow/specs/[id]` (GET, PUT)
- `/api/workflow/specs/[id]/content` (GET)
- `/api/workflow/sync` (POST)

### Frontend Layer (Not Started)
⏳ UI components and pages pending implementation:
- `/workflow` page
- Kanban board components
- Drag-and-drop functionality (@dnd-kit not yet installed)

### Scenario Status
- **All scenarios**: Backend logic and tests written, but not yet integrated with API/UI
- **Next step**: Implement API routes to connect services with frontend

## Scenarios

### Happy Path: View Specs Organized by Workflow Stage
```gherkin
Given I have 3 spec files: "create-post.md" (pending), "archive-posts.md" (in-progress), "user-profile.md" (completed)
And each spec has been synced to the database
When I navigate to the /workflow page
Then I should see a Kanban board with 3 columns: "Pending", "In Progress", "Completed"
And I should see "create-post.md" card in the "Pending" column
And I should see "archive-posts.md" card in the "In Progress" column
And I should see "user-profile.md" card in the "Completed" column
And each card should display the spec title, domain, scenario count, and created date
```

### Happy Path: Drag Spec Card Between Stages
```gherkin
Given I am viewing the Kanban board
And there is a spec card "create-post.md" in the "Pending" column with status "pending"
When I drag the "create-post.md" card to the "In Progress" column
And I drop the card
Then the card should move to the "In Progress" column
And the spec status should update to "in-progress" in the database
And I should see visual feedback confirming the successful move
```

### Happy Path: Create New Spec from Kanban Board
```gherkin
Given I am viewing the Kanban board
When I click the "Create New Spec" button
Then I should see a dialog with a form
And the form should have fields for: domain, feature name, and description
When I fill in domain "posts", feature name "delete-post", and description "Allow users to delete their posts"
And I click "Create Spec"
Then a new spec file should be created at "specs/posts/delete-post.md"
And a database record should be created with status "pending"
And the new card should appear in the "Pending" column
And the dialog should close
```

### Happy Path: View Spec Details from Card
```gherkin
Given I am viewing the Kanban board
And there is a spec card "archive-posts.md" in the "In Progress" column
When I click on the "archive-posts.md" card
Then a slide-out panel should open on the right side
And the panel should display the full spec content from the .md file
And the panel should show metadata: status, domain, created date, updated date, scenario count
And I should see a "View File" link to open the .md file in an editor
And I should see a "Close" button to dismiss the panel
```

### Edge Case: Sync Specs from Filesystem
```gherkin
Given I have 2 spec files in the filesystem: "specs/posts/create-post.md" and "specs/users/user-login.md"
And these specs are not yet in the database
When I trigger the filesystem sync (via API endpoint or manual action)
Then the system should scan the specs/ directory recursively
And it should create database records for both specs
And it should extract metadata from the markdown files (title, domain, scenario count)
And both specs should appear in the Kanban board with status "pending"
And I should see a success message: "Synced 2 specs from filesystem"
```

### Edge Case: Handle Empty Workflow Stages
```gherkin
Given I am viewing the Kanban board
And there are no specs in the "Completed" column
When the page loads
Then the "Completed" column should display
And it should show placeholder text: "No completed specs yet"
And I should still be able to drag cards into this empty column
```

### Edge Case: Prevent Invalid Status Transitions
```gherkin
Given I am viewing the Kanban board
And there is a spec card "user-profile.md" with status "completed" in the "Completed" column
When I try to drag the card back to the "Pending" column
Then the system should prevent the move (or allow with warning)
And the card should return to its original position
And I should see a message: "Cannot move completed specs back to pending"
```

## Dependencies
- **Database**: PostgreSQL (via Drizzle ORM)
- **Drag & Drop Library**: @dnd-kit/core, @dnd-kit/sortable
- **UI Components**: shadcn/ui (Card, Button, Dialog, Sheet, Badge)
- **Filesystem**: Node.js fs module for scanning specs/ directory
- **Authentication**: better-auth (protect /workflow page)

## Notes
- Cards should be visually distinct with color-coding by status
- Drag-and-drop should work on both desktop and touch devices
- The filesystem sync should be idempotent (safe to run multiple times)
- Consider real-time updates if multiple developers are working on specs
- Performance: Paginate or virtualize if >50 specs exist
- Accessibility: Ensure keyboard navigation and screen reader support for drag-and-drop

---
*Generated: 2025-10-02*
*Next step: `/implement specs/workflow/spec-kanban-board.md`*
