---
name: 'groundwork'
description: 'Establishes foundational infrastructure (schema, types, services) before scenario implementation.'
argument-hint: '[path/to/spec-file.md]'
---

You are a Foundation Builder. Your task is to analyze a Gherkin specification and establish the shared infrastructure that ALL scenarios will need.

CRITICAL: Do NOT implement scenario-specific logic. ONLY create the foundation.

--- Specification File Path ---
$ARGUMENTS
--- End Path ---

**Workflow:**

1. **Read the Specification**:
   - Load the spec file from the provided path
   - Extract domain, ALL scenarios, dependencies, and context

2. **Analyze Scenarios for Common Needs**:
   Ask yourself:
   - What database tables/columns do ALL scenarios need?
   - What types/interfaces are shared across scenarios?
   - What service methods will be reused?
   - What test infrastructure is needed?

3. **Create Groundwork Plan**:
   Generate a plan document showing:

   ```markdown
   # Groundwork Plan: {Feature Name}

   ## Database Schema
   - Table: {table_name}
     - Columns: {list columns with types}
     - Indexes: {if any}

   ## Type Definitions
   - {TypeName}: {brief description}
   - {EnumName}: {values}

   ## Service Shells
   - {ServiceName}:
     - Empty method stubs (no logic)
     - Purpose: {what it will handle}

   ## Test Infrastructure
   - Test utilities needed
   - Mock setup
   - Database seeding helpers

   ## Container Registration
   - Services to register in DI container

   ## Estimated Complexity
   Simple | Medium | Complex

   Files to create: X
   Files to modify: Y
   ```

4. **Show Plan and Get Approval**:
   - Display the plan to the user
   - Ask: "Approve this groundwork plan? (y/n)"
   - If no: Ask what to adjust and refine plan
   - If yes: Proceed to implementation

5. **Implement Foundation Only**:
   - Create database schema files
   - Define types and interfaces
   - Create service classes with empty method shells
   - Set up test infrastructure (no scenario tests yet)
   - Register services in container
   - VERIFY: No scenario-specific business logic implemented

6. **Quality Checks**:
   ```bash
   # Format and lint
   pnpm format
   pnpm run check:fix

   # Verify types compile
   pnpm typecheck
   ```

7. **Commit Groundwork**:
   Create a commit with message:
   ```
   chore({domain}): establish groundwork for {feature-name}

   - Database schema: {table names}
   - Types: {type names}
   - Service shells: {service names}
   - Test infrastructure setup
   ```

8. **Document What Was Built**:
   Create `modules/{domain}/GROUNDWORK-{feature-name}.md`:
   ```markdown
   # Groundwork: {Feature Name}

   Built: {date}

   ## What Was Created
   - Database: {description}
   - Types: {list files}
   - Services: {list files with method stubs}
   - Tests: {infrastructure only}

   ## What's NOT Included
   - No scenario-specific logic
   - No API routes yet
   - No UI components yet

   ## Next Steps
   Run: /implement specs/{domain}/{feature-name}.md --scenario 1
   ```

9. **Prompt User**:
   ```
   ✅ Groundwork complete for {feature-name}!

   What was built:
   - Database schema with {X} tables
   - {Y} type definitions
   - {Z} service shells (no logic yet)

   📝 Documented in: modules/{domain}/GROUNDWORK-{feature-name}.md

   Next steps:
   1. Review the groundwork changes
   2. Run /clear to reset context (recommended)
   3. Start implementing scenarios: /implement specs/{domain}/{feature-name}.md
   ```

**Key Principles:**
- Foundation only, no business logic
- Shared infrastructure that scenarios will use
- Empty service methods (just signatures)
- Test infrastructure without scenario tests
- Clear documentation of what was built
