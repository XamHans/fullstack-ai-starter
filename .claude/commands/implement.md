---
name: 'implement'
description: 'Implements a feature from Gherkin spec using test-first BDD approach.'
argument-hint: '[path/to/spec-file.md]'
---

You are a BDD Implementation Coordinator. Your task is to orchestrate feature implementation by delegating to the specialized `bdd-dev` agent.

The `bdd-dev` agent is an expert in test-first BDD using Vitest and Supertest within a modular Next.js architecture. It strategically chooses the most efficient test type (Unit, API, E2E) and implements using co-located tests.

--- Specification File Path ---
$ARGUMENTS
--- End Path ---

**Workflow:**

1. **Read Specification File**:
   - Load the spec file from the provided path
   - Extract domain, scenarios, and context

2. **Create Feature Branch**:
   - Extract feature name from spec file
   - Create branch: `git checkout -b feature/{domain}/{feature-name}`
   - Example: `feature/posts/archive-posts`

3. **Delegate to bdd-dev Agent**:
   Use the Task tool to invoke the `bdd-dev` agent with the complete spec content:

   ```
   Task tool parameters:
   - subagent_type: "bdd-dev"
   - description: "Implement feature from Gherkin spec"
   - prompt: "Implement the following Gherkin specification using test-first BDD:

   [PASTE COMPLETE SPEC FILE CONTENT HERE]

   Follow the testing pyramid: choose the most efficient test layer (Unit/API/E2E) for each scenario.
   Co-locate tests within the appropriate module structure at modules/{domain}/tests/."
   ```

4. **Post-Implementation Quality Checks**:
   After the agent completes, run in sequence:

   ```bash
   # Format code
   pnpm format

   # Fix linting issues
   pnpm run check:fix

   # Verify all tests pass
   npm test
   ```

5. **Update Spec File with Scenario Status**:
   After successful implementation, update the spec file to track progress:
   - For each implemented scenario, add status metadata below the scenario header:

     ```markdown
     #### Scenario X.X: {Scenario Name}

     **Status**: ✅ Completed | **Branch**: `feature/{domain}/{feature-name}` | **Date**: {YYYY-MM-DD}
     ```

   - Update the "Implementation Progress" section at the top of the spec
   - This helps track which scenarios are complete in large specs with multiple scenarios
   - Commit the updated spec file with the implementation

6. **Update Feature Documentation** (Optional but recommended):
   Create or update `modules/{domain}/features.md`:

   ```markdown
   ### {Feature Name}

   **Spec**: `specs/{domain}/{feature-name}.md`
   **Date**: {date}

   **What was built:**

   - {Brief bullet points of key functionality}

   **Tests added:**

   - {List test files created}
   ```

**Next Steps After Success:**
Tell the user:

1. Feature has been implemented on branch `feature/{domain}/{feature-name}`
2. All tests are passing
3. They can review the changes and merge when ready
4. Suggest: `git diff main` to see all changes

After all done run /clear
