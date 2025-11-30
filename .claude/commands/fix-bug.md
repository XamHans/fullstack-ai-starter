Excellent additions. This integrates professional-grade best practices (context awareness and proper version control) directly into the debugging workflow.

Here is the updated `/debug` command. It now starts by assessing the available tools and ensures all work is done on a dedicated branch before proposing a fix, culminating in instructions for a Pull Request.

### The Enhanced `/debug` Slash Command

Save this as `.claude/commands/debug.md`. It's now a comprehensive, multi-step guide for the AI.

**File:** `.claude/commands/debug.md`

````markdown
---
description: 'A full-cycle debugging workflow: diagnose, branch, fix, and prepare PR.'
argument-hint: '[A brief description of the bug you are seeing]'
allowed-tools: Bash
---

# Full-Cycle Debugging Session

**Objective**: To systematically diagnose a bug, ensure work is done on a dedicated branch, implement a fix, and prepare a Pull Request for review.

---

## Step 1: Environment & Tooling Check

Before we begin, I am assessing the current environment to understand what tools are at my disposal.

**Available MCP Servers:**
!`/mcp list`

**Current Git Status:**
!`git status --short`

I will use the available MCP servers (like `vercel` for logs or `neon` for database queries) during the investigation phase.

---

## Step 2: Understand the Problem

Now, I need to understand the issue from your perspective. Please answer the following questions.

1.  **What is the current, incorrect behavior?**
2.  **Where exactly does this happen?** (URL, component name, API endpoint, etc.)
3.  **What is the expected, correct behavior?**

Your description: $ARGUMENTS

**Please provide the answers to these three questions. I will wait for your response before formulating an investigation plan.**

---

## Step 3: Investigation and Verification

_(This is my next step after you answer the questions above)_

Based on your answers, I will analyze the situation and propose a plan to gather more information using the tools identified in Step 1. My goal is to find logs or data that confirm the root cause.

For example, I might suggest:

- "May I run `!/mcp__vercel__logs` to check for recent server errors?"
- "Could we query the database with `!/mcp__neon__query 'SELECT * FROM ...'` to check data integrity?"

**I will always ask for your permission before running any commands.** We will work together until we have a high degree of confidence in the root cause.

---

## Step 4: Prepare for the Fix (Git Branching)

Once we have identified the root cause, we must ensure the fix is developed on a dedicated branch.

**Current Branch:** !`git branch --show-current`

**Your Task:**

- If the current branch is `main` or `master`, you **must** create a new branch before we proceed.
- Please create a descriptive branch name. A good convention is `fix/[issue-id]-[short-description]`.

**Example:**

```bash
# Replace with your issue number and description
git checkout -b fix/123-dashboard-chart-loader
```
````

**Let me know once you are on the new branch.** I will verify by checking the current branch again before proposing any code changes.

---

## Step 5: Implement the Fix and Finalize

_(This is my next step after you confirm you are on the correct branch)_

Once you're on the new branch, I will provide the necessary code changes to fix the bug. After you apply and test the fix, we will use our `/commit-fix` command to finalize your work.

---

## Step 6: Create a Pull Request

After the fix is committed, the final step is to share your work for review.

**Your Task:**

1.  Push your branch to the remote repository. I will provide the exact command, which will look like this:
    ```bash
    git push --set-upstream origin [your-branch-name]
    ```
2.  Go to your Git provider (GitHub, GitLab, etc.) and open a new Pull Request from your branch to the `master` or `main` branch.
3.  Use a clear title and description for your PR, referencing the issue ID.
