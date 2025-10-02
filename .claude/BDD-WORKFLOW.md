# BDD Workflow Guide

This project uses a **3-phase BDD workflow** to guide feature development from idea to implementation.

## 🎯 The Three Phases

```
User Idea → [Phase 1: Spec] → [Phase 2: Plan] → [Phase 3: Implement] → Working Feature
```

### Phase 1: Create Specification (Required)
**Command**: `/create-specs [your feature idea]`

**What it does**:
- Takes your rough idea and creates structured Gherkin scenarios
- Generates a lightweight spec file in `specs/{domain}/{feature-name}.md`
- Focuses on behavior (Given/When/Then), not implementation details
- Follows YAGNI: minimal, actionable, testable scenarios

**Output**:
- A spec file with 2-4 Gherkin scenarios covering happy path and key edge cases

**Example**:
```bash
/create-specs "Add ability to archive posts without deleting them"
```

Creates: `specs/posts/archive-posts.md` with scenarios like:
- Archive a published post
- Unarchive a post
- Handle errors (archive non-existent post)

---

### Phase 2: Create Implementation Plan (Optional)
**Command**: `/plan-spec specs/{domain}/{feature-name}.md`

**What it does**:
- Analyzes the Gherkin spec and existing codebase
- Strategically selects test layers (Unit/API/E2E) for each scenario
- Identifies files to create/modify
- Estimates complexity and implementation order
- Provides a roadmap before writing code

**Output**:
- A detailed implementation plan showing test strategy, file changes, and prerequisites

**When to use**:
- For complex features that touch multiple parts of the system
- When you want to review the approach before implementation
- To understand impact and effort required

**When to skip**:
- For simple features with obvious implementation
- When you trust the BDD agent to make good decisions
- When you want to move fast (go directly to Phase 3)

**Example**:
```bash
/plan-spec specs/posts/archive-posts.md
```

Shows:
- Archive scenario → Unit test (service logic)
- API endpoint scenario → API integration test
- Files to create/modify in `modules/posts/`
- Database schema change (add `archivedAt` field)

---

### Phase 3: Implement Feature (Required)
**Command**: `/implement specs/{domain}/{feature-name}.md`

**What it does**:
- Reads the Gherkin spec file
- Creates a feature branch
- Delegates to the `bdd-dev` agent for test-first implementation
- Runs quality checks (format, lint, tests)
- Documents what was built

**Output**:
- Working feature with passing tests
- Code formatted and linted
- Feature branch ready for review

**What the bdd-dev agent does**:
1. Analyzes each Gherkin scenario
2. Chooses optimal test layer (Unit/API/E2E)
3. Writes failing test first (Red)
4. Implements minimal code to pass (Green)
5. Refactors while keeping tests green
6. Co-locates tests within `modules/{domain}/tests/`

**Example**:
```bash
/implement specs/posts/archive-posts.md
```

Creates:
- `modules/posts/services/post.service.ts` (adds archive methods)
- `modules/posts/tests/unit/post-archive.test.ts` (unit tests)
- `modules/posts/tests/integration/post-archive.api.test.ts` (API tests)
- Database migration for `archivedAt` field
- Feature branch: `feature/posts/archive-posts`

---

## 🏗️ Architecture Overview

### Module Structure
```
modules/
└── {domain}/
    ├── services/          # Business logic
    ├── types/             # TypeScript types
    ├── schema.ts          # Database schema
    └── tests/
        ├── unit/          # Fast, isolated tests
        └── integration/   # API tests with Supertest
```

### Spec Structure
```
specs/
└── {domain}/
    └── {feature-name}.md  # Gherkin scenarios
```

### Testing Pyramid
```
        E2E (Few)
      ┌─────────┐
     │  Full    │
    │  User     │
   │  Journeys  │
  └────────────┘

     API Tests (Some)
  ┌──────────────────┐
 │  HTTP Contracts   │
│  Route Handlers    │
└────────────────────┘

      Unit Tests (Many)
  ┌────────────────────────┐
 │  Business Logic         │
│  Validation, Services    │
│  Fast, Isolated          │
└──────────────────────────┘
```

---

## 📋 Example Workflow

### Scenario: User wants to add post archiving

**Step 1: Create Spec**
```bash
/create-specs "Add ability to archive posts"
```

**Result**: `specs/posts/archive-posts.md` created with 4 scenarios

**Step 2a: Review Spec (Manual)**
- Read the generated scenarios
- Adjust if needed
- Confirm they capture the behavior

**Step 2b: Create Plan (Optional)**
```bash
/plan-spec specs/posts/archive-posts.md
```

**Result**: Implementation plan showing test strategy and file changes

**Step 3: Implement**
```bash
/implement specs/posts/archive-posts.md
```

**Result**:
- Feature implemented on `feature/posts/archive-posts` branch
- All tests passing ✅
- Code formatted and linted ✅
- Ready for review

**Step 4: Review and Merge**
```bash
git diff main
# Review changes, then merge when ready
```

---

## 🎨 Key Principles

### YAGNI (You Aren't Gonna Need It)
- Write only what's needed for the current scenarios
- Don't over-engineer or plan for future features
- Keep specs focused and minimal

### Vibe Coding
- Guided by existing codebase patterns
- Uses MCP tools to discover conventions
- Adapts to project structure, not rigid templates

### Test-First BDD
- Red: Write failing test that captures Gherkin scenario
- Green: Write minimal code to make test pass
- Refactor: Clean up while keeping tests green

### Strategic Test Selection
- **Unit** for business logic and validation
- **API** for HTTP contracts and endpoints
- **E2E** only for critical multi-module user journeys

### Co-located Tests
- Tests live with the code they test
- Improves discoverability and maintainability
- Makes refactoring safer

---

## 🚀 Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/create-specs [idea]` | Generate Gherkin scenarios | Always (Phase 1) |
| `/plan-spec [spec-path]` | Create implementation plan | For complex features or when you want a roadmap |
| `/implement [spec-path]` | Build the feature | Always (Phase 3) |

---

## 💡 Tips

1. **Start small**: Write 2-3 scenarios, not 10. Add more later if needed.

2. **Review specs before implementing**: Ensure scenarios are clear and testable.

3. **Skip planning for simple features**: Go directly from spec to implement.

4. **Use planning for complex features**: Understand impact before writing code.

5. **Trust the BDD agent**: It will choose appropriate test layers and patterns.

6. **Iterate**: Specs can be refined based on implementation learnings.

---

## 📚 Further Reading

- `docs/architecture/testing-strategy.mdx` - Testing patterns and philosophy
- `docs/architecture/code-architecture.mdx` - Module structure and organization
- `docs/architecture/api-architecture.mdx` - API design patterns
- `.claude/agents/bdd-dev.md` - BDD agent implementation details
