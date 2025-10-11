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

1. **Read Constitution**:
   - Load `.claude/constitution.md` to understand architectural principles
   - Pay special attention to Articles I (Simplicity), II (Anti-Abstraction), IX (Groundwork Separation)

2. **Read the Specification**:
   - Load the spec file from the provided path
   - Extract domain, ALL scenarios, dependencies, and context
   - **BLOCK if `[NEEDS CLARIFICATION]` markers exist**: Cannot create groundwork with ambiguities

3. **Check Constitutional Gates**:
   Before creating any infrastructure, verify:

   **Simplicity Gate (Article I)**:
   - [ ] Is this the simplest approach for the scenarios?
   - [ ] No future-proofing (only build what scenarios need)?
   - [ ] Minimal modules/files/abstractions?

   **Anti-Abstraction Gate (Article II)**:
   - [ ] Using Next.js/Drizzle directly without wrappers?
   - [ ] Single representation per domain concept?
   - [ ] No unnecessary abstraction layers?

   **Groundwork Gate (Article IX)**:
   - [ ] Feature has database changes requiring shared schema?
   - [ ] Multiple scenarios share common infrastructure?
   - [ ] Complex enough to justify upfront setup?

   If any gate fails, document justified exceptions or simplify approach.

4. **Analyze Scenarios for Common Needs**:
   Ask yourself:
   - What database tables/columns do ALL scenarios need?
   - What types/interfaces are shared across scenarios?
   - What service methods will be reused?
   - What test infrastructure is needed?

5. **Create Groundwork Plan**:
   Generate a plan document showing:

   ```markdown
   # Groundwork Plan: {Feature Name}

   ## Constitutional Gate Results

   ### Simplicity Gate (Article I)
   - [ ] Simplest approach? {Yes/No + explanation}
   - [ ] No future-proofing? {Yes/No + what was avoided}
   - [ ] Minimal modules/files? {Yes/No + justification}

   ### Anti-Abstraction Gate (Article II)
   - [ ] Using frameworks directly? {Yes/No + examples}
   - [ ] Single representation per concept? {Yes/No + details}
   - [ ] No unnecessary abstractions? {Yes/No + justification}

   ### Groundwork Gate (Article IX)
   - [ ] Database changes needed? {Yes/No + what tables}
   - [ ] Shared infrastructure across scenarios? {Yes/No + examples}
   - [ ] Complex enough to justify setup? {Yes/No + reasoning}

   ## Database Schema
   - Table: {table_name}
     - Columns: {list columns with types}
     - Indexes: {if any}
     - Rationale: {why these columns for current scenarios}

   ## Type Definitions
   - {TypeName}: {brief description}
   - {EnumName}: {values}
   - Rationale: {why single representation is sufficient}

   ## Service Shells
   - {ServiceName}:
     - Empty method stubs (no logic)
     - Purpose: {what it will handle}
     - Methods: {list method signatures only}

   ## Test Infrastructure
   - Test utilities needed
   - Database seeding helpers
   - Contract test setup

   ## Container Registration
   - Services to register in DI container

   ## Complexity Tracking

   {If no exceptions:}
   ✅ All constitutional gates pass - no exceptions needed

   {If exceptions needed:}
   ### Exception: {What principle violated}
   - **Principle**: Article {number} ({name})
   - **Justification**: {Why violation is necessary}
   - **Impact**: {What complexity this introduces}
   - **Alternatives Considered**: {Why simpler approaches won't work}

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
   Spec: `specs/{domain}/{feature-name}.md`

   ## Constitutional Compliance

   ### Simplicity Gate (Article I) ✅
   - Simplest approach for current scenarios
   - No future-proofing
   - Minimal {X} files created

   ### Anti-Abstraction Gate (Article II) ✅
   - Using {framework names} directly
   - Single representation per domain concept
   - No unnecessary wrappers

   ### Groundwork Gate (Article IX) ✅
   - {X} database tables for shared schema
   - {Y} scenarios share this infrastructure
   - Justified upfront setup

   ## What Was Created

   ### Database Schema
   - Tables: {list with column counts}
   - Migrations: {file paths}
   - Rationale: {why these tables}

   ### Type Definitions
   - Files: {list files}
   - Types: {list type names}
   - Rationale: {why single representation}

   ### Service Shells
   - Files: {list files}
   - Methods: {list method signatures - EMPTY, no logic}
   - Rationale: {what scenarios will use these}

   ### Test Infrastructure
   - Utilities: {list files}
   - Database helpers: {list helpers}
   - Contract test setup: {what was configured}

   ## What's NOT Included

   - ❌ No scenario-specific logic
   - ❌ No business logic in services (empty shells only)
   - ❌ No API routes yet
   - ❌ No UI components yet
   - ❌ No scenario tests yet

   ## Complexity Tracking

   {If no exceptions:}
   ✅ No constitutional exceptions required

   {If exceptions:}
   ### Exception: {What}
   - **Principle**: Article {number}
   - **Justification**: {Why}
   - **Impact**: {Complexity added}

   ## Next Steps

   1. Review this groundwork
   2. Run `/clear` to reset context (recommended)
   3. Start implementing scenarios:
      - `/implement specs/{domain}/{feature-name}.md --scenario 1`
      - Or generate tasks first: `/create-tasks specs/{domain}/{feature-name}.md`
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
