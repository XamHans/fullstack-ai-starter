# Project Commands and Guidelines

## BDD Workflow

This project uses a 4-phase BDD workflow for feature development:

1. `/create-specs [idea]` - Generate Gherkin scenarios from rough ideas
2. `/groundwork [spec-path]` - Build shared infrastructure (run /clear after)
3. `/plan-spec [spec-path]` - Create implementation plan (optional)
4. `/implement [spec-path]` - Implement scenarios one-by-one (suggest /clear between)

### BDD Best Practices

- **ALWAYS** run `/groundwork` before implementing scenarios with database changes
- **Use /clear** between workflow phases to keep context focused and improve performance
- **Implement one scenario at a time** for better code quality and easier review
- **Groundwork = shared infrastructure only** - NO business logic, NO scenario-specific code
- **Each scenario gets its own branch**: `feature/{domain}/{feature}/{scenario-slug}`
- **Review specs before implementing** to ensure scenarios are clear and testable

### When to Skip Groundwork

- Simple features with no database changes
- Single-file utilities or helpers
- When prototyping and speed matters most

## Testing Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test path/to/test.spec.ts

# Run tests in watch mode
npm test -- --watch

# Format code
pnpm format

# Lint and fix
pnpm run check:fix

# Type check
pnpm typecheck
```

## Code Style

- Use TypeScript strict mode
- Prefer functional components with hooks
- Co-locate tests with the code they test in `modules/{domain}/tests/`
- Follow testing pyramid: Many unit tests, some API tests, few E2E tests
- Use Drizzle ORM for database operations
- Use better-auth for authentication

## Module Structure

```
modules/
└── {domain}/
    ├── services/          # Business logic
    ├── types/             # TypeScript types
    ├── schema.ts          # Database schema (Drizzle)
    └── tests/
        ├── unit/          # Fast, isolated tests (Vitest)
        └── integration/   # API tests (Vitest + Supertest)
```

## Workflow Patterns

### After Groundwork
```bash
/groundwork specs/posts/archive-posts.md
# Review changes, then:
/clear
/implement specs/posts/archive-posts.md
```

### Between Scenarios
```bash
# After completing scenario 1:
/clear
# Then implement scenario 2 with fresh context:
/implement specs/posts/archive-posts.md --scenario 2
```

## Important Notes

- **Context management is critical** - Use /clear frequently
- **Test-first development** - Write failing tests before implementation
- **Vertical slicing** - Each scenario should deliver end-to-end functionality (API + UI)
- **YAGNI principle** - Only build what's needed for current scenarios
- **Documentation** - Update GROUNDWORK.md and spec files as you go
