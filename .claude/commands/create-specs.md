---
description: 'Transforms a rough idea into a structured Product Requirement Prompt (PRP).'
argument-hint: '[your feature idea or task description]'
---

You are a senior AI engineer. Your task is to take a user's rough idea and transform it into a comprehensive **Product Requirement Prompt (PRP)**. A PRP contains all the context and instructions an AI agent needs to implement a feature in one pass.

**Your Idea:**
$ARGUMENTS

**Discovery Process:**

1.  **Understand the Idea**: Clarify the user's core request.
2.  **Codebase Analysis**:
    - Run `ls -R` to understand the project structure.
    - Identify relevant files, existing patterns, and conventions in the codebase that relate to the idea. Reference them using `@` notation.
    - **Architecture Discovery**: Examine relevant architecture documentation:
      - For API features → reference `@docs/architecture/api-architecture.mdx`
      - For database changes → reference `@docs/architecture/database.mdx`
      - For authentication → reference `@docs/architecture/authentication.mdx`
      - For testing strategy → reference `@docs/architecture/testing-strategy.mdx`
      - For code patterns → reference `@docs/architecture/code-architecture.mdx`
    - **Test Pattern Discovery**: Examine existing test patterns in `modules/{domain}/tests/` to understand the testing approach
3.  **External Research**:
    - Perform web searches for official documentation of any relevant libraries or APIs.
    - Search for best practices or common pitfalls related to the task.
4.  **Tool Discovery (MCP)**:
    - Use `/mcp list` to see available servers.
    - If relevant, use `/mcp tools [server-name]` to find tools that could help with the implementation (e.g., for creating tickets, fetching data).
5.  **User Clarification**: Ask me questions if you need more details to form a complete plan.

**PRP Generation:**

Once you have all the context, generate a complete PRP using the following template. Fill in every section based on your discovery.

**After PRP Generation:**

1. **Create Specification File**: Automatically create a markdown file in `specs/{domain}/` directory
   - **File naming**: Use feature name (e.g., `specs/posts/create-post.md`, `specs/users/user-authentication.md`)
   - **Create directories**: Auto-create `specs/` and `specs/{domain}/` if they don't exist
   - **File content**: Include the generated Gherkin scenarios and key implementation details
   - **Reference**: This file will be used by the execute-specs command

```markdown
### Goal

[A clear, one-sentence goal for the feature.]

### Why

[The business value or problem this solves.]

### All Needed Context

[List all relevant files, URLs, and MCP commands discovered during your research. This is CRITICAL.]

- **File:** `@[path/to/relevant/file.py]` - Why: [Reason it's relevant]
- **URL:** `[https://...docs]` - Why: [Specific section to consult]
- **Tool:** `[/mcp__server__prompt]` - Why: [How it should be used]

### Implementation Blueprint

[A detailed, step-by-step plan for how to build the feature using test-first BDD approach. Break it down into logical tasks.]

**Planning Phases:**
1.  **Feature Specification**: Define the feature requirements using simple Gherkin scenarios in `specs/{domain}/` directory
2.  **Architecture Planning**: Determine the technical approach:
    - **Module Structure**: Which domain module will house the feature
    - **Test Strategy**: What types of tests are needed (Unit/API/E2E)
    - **Database Changes**: Schema modifications required
    - **API Design**: Endpoints and contracts needed
    - **Frontend Integration**: UI components and user flows

**Implementation Phases:**
3.  **Test-First Development**: Create failing tests before implementation
4.  **Business Logic**: Implement core functionality in service layer
5.  **API Layer**: Create robust API endpoints with proper error handling
6.  **Frontend Layer**: Build user interface and user experience
7.  **Integration**: Connect all layers and ensure end-to-end functionality

**Quality Assurance:**
8.  **Testing**: Comprehensive test coverage across all layers
9.  **Code Quality**: Formatting, linting, and type safety
10. **Documentation**: Update relevant documentation

### Validation Gates

[How will we know the feature is working correctly? Define success criteria and testing approach.]

**Functional Validation:**
- **Feature Scenarios**: All Gherkin scenarios pass when implemented
- **User Acceptance**: Feature meets the original requirements
- **Edge Cases**: Boundary conditions and error scenarios are handled

**Technical Validation:**
- **Test Coverage**: Comprehensive test suite with appropriate coverage
- **Code Quality**: Clean, maintainable, and well-documented code
- **Performance**: Feature performs within acceptable parameters
- **Security**: Proper authentication, authorization, and data validation

**Integration Validation:**
- **API Contracts**: Endpoints work as designed with proper error handling
- **Database**: Schema changes don't break existing functionality
- **Frontend**: UI/UX meets design requirements and is accessible
- **End-to-End**: Complete user journeys work seamlessly
```

### Specification File Template

After generating the PRP, create a specification file using this template:

**File**: `specs/{domain}/{feature-name}.md`

```markdown
# {Feature Name}

## Overview
[Brief description of the feature and its purpose]

## Business Value
[Why this feature is needed and what problem it solves]

## Scenarios

### Scenario 1: {Happy Path Scenario}
```
Given [initial state]
When [action is performed]
Then [expected outcome]
```

### Scenario 2: {Alternative/Error Scenario}
```
Given [initial state]
When [different action or error condition]
Then [expected error handling or alternative outcome]
```

## Technical Requirements
- **Domain Module**: `modules/{domain}/`
- **Database Changes**: [Any schema modifications needed]
- **API Endpoints**: [List of endpoints to create/modify]
- **Frontend Components**: [UI components needed]

## Implementation Notes
[Any specific technical considerations or constraints]

---
*Generated by create-specs command on {date}*
*Execute with: `/execute-specs specs/{domain}/{feature-name}.md`*
```

**Example Spec File Creation:**
```bash
# Auto-create directory structure
mkdir -p specs/posts

# Write the specification file
Write file: specs/posts/create-post.md
[Include generated Gherkin scenarios and implementation details]
```
