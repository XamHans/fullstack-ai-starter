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

1.5. **Verify Groundwork Exists**:
   - Extract feature name from spec file
   - Check if `modules/{domain}/GROUNDWORK-{feature-name}.md` exists
   - If NOT found:
     - Inform user: "⚠️  No groundwork found. For best results, run /groundwork first."
     - Ask: "Continue without groundwork? (y/n)"
     - If no: Exit and suggest running /groundwork
     - If yes: Note that minimal infrastructure will be created as needed

2. **Parse Scenarios from Spec**:
   - Parse spec file to identify all scenarios
   - Check which scenarios are already completed (look for "**Status**: ✅ Completed" in spec)
   - Display scenario list with status:

   ```
   Available scenarios in {feature-name}:

   1. ⏳ View Specs Organized by Workflow Stage
   2. ⏳ Drag Spec Card Between Stages
   3. ✅ Create New Spec from Kanban Board (completed)
   4. ⏳ View Spec Details from Card
   5. ⏳ Sync Specs from Filesystem
   6. ⏳ Handle Empty Workflow Stages

   Select scenario to implement (1-6):
   ```

   - Accept scenario selection via:
     - User input at prompt
     - CLI argument: --scenario 2
     - CLI argument: --scenario "drag-spec-card"

3. **Create Scenario-Specific Branch**:
   - Extract feature name and selected scenario from spec file
   - Create branch: `git checkout -b feature/{domain}/{feature-name}/{scenario-slug}`
   - Example: `feature/workflow/spec-kanban-board/sync-specs-filesystem`
   - Use kebab-case scenario slug derived from scenario title

4. **Extract Selected Scenario**:
   - Extract ONLY the selected scenario from the spec file
   - Include: Context, Domain, Dependencies sections
   - Include: Only the selected scenario's Gherkin (not all scenarios)
   - Include: Relevant notes for that scenario

5. **Delegate to bdd-dev Agent**:
   Use the Task tool to invoke the `bdd-dev` agent with the SINGLE scenario:

   ```
   Task tool parameters:
   - subagent_type: "bdd-dev"
   - description: "Implement single scenario from Gherkin spec"
   - prompt: "Implement the following Gherkin scenario using test-first BDD:

   [PASTE EXTRACTED SCENARIO CONTENT HERE - SINGLE SCENARIO ONLY]

   IMPORTANT: Implement this scenario with VERTICAL SLICING:
   - Create/update API routes needed for this scenario
   - Create/update UI components needed for this scenario
   - Write integration tests for the API endpoints
   - Ensure end-to-end functionality for THIS scenario only

   Follow the testing pyramid: choose the most efficient test layer (Unit/API/E2E).
   Co-locate tests within the appropriate module structure at modules/{domain}/tests/.

   Backend services and unit tests may already exist - focus on API routes and frontend if so."
   ```

6. **Post-Implementation Quality Checks**:
   After the agent completes, run in sequence:

   ```bash
   # Format code
   pnpm format

   # Fix linting issues
   pnpm run check:fix

   # Verify all tests pass
   npm test
   ```

7. **Update Spec File with Scenario Status**:
   After successful implementation, update the spec file to track progress:
   - Add status metadata directly below the implemented scenario's title:

     ```markdown
     ### Scenario Name Here
     **Status**: ✅ Completed | **Branch**: `feature/{domain}/{feature-name}/{scenario-slug}` | **Date**: {YYYY-MM-DD}
     ```

   - Update the "Implementation Progress" section at the top of the spec
   - List which specific scenario was completed
   - Commit the updated spec file with the implementation

8. **Prompt for Next Scenario with Context Management**:
   After completing one scenario:

   Show completion summary:
   ```
   ✅ Scenario {N} completed: "{Scenario Name}"

   What was built:
   - API routes: {list routes created/modified}
   - UI components: {list components created/modified}
   - Tests: {X} tests added, all passing ✅
   - Files modified: {count}

   Remaining scenarios: {count}
   ```

   Ask: "Continue with next scenario? (y/n)"

   If yes:
   - Ask: "Clear context with /clear before continuing? (Recommended for better performance) (y/n)"
     - If yes to clear:
       ```
       👉 Please run /clear now, then restart with:
       /implement specs/{domain}/{feature-name}.md --scenario {next-number}

       This keeps context focused and improves AI performance.
       ```
     - If no to clear:
       ```
       ⚠️  Continuing without clearing context.
       Performance may degrade with large context windows.

       Proceeding to next scenario...
       ```
       Return to step 2 for next incomplete scenario

   If no: Proceed to documentation step

9. **Update Feature Documentation** (Optional but recommended):
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

1. Scenario has been implemented on branch `feature/{domain}/{feature-name}/{scenario-slug}`
2. All tests are passing
3. They can review the changes and merge when ready
4. Suggest: `git diff main` to see all changes
5. If more scenarios remain, offer to continue with next scenario

After all done run /clear
