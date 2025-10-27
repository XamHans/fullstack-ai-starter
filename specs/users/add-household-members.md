# Add Household Members

## Context

After creating a household, the user needs to add members to it. Each member has their own personal habits and inspiration prompts, so this step is crucial for personalizing the app experience.

## Domain

`modules/users/`

## Implementation Progress

<!-- Track scenario implementation below -->

⏳ All scenarios pending

## Uncertainties

- `[NEEDS CLARIFICATION]`: What is the minimum and maximum number of members a household can have?
  5
- `[NEEDS CLARIFICATION]`: What are the validation rules for a member's name (e.g., min/max length, special characters)? basic rules, no empty , keep it easy
- `[NEEDS CLARIFICATION]`: Is the avatar/profile icon upload mandatory? If not, what is the default? If it is an upload, what are the file size and format constraints? no not mandatoy
- `[NEEDS CLARIFICATION]`: Are there any length limits or other validation rules for the "inspiration prompt"? no

## Scenarios

### Happy Path: A user adds a new member to the household

```gherkin
Given the user has created a household
And they are on the "Add Household Members" screen
When they enter the name "Johannes"
And they define 3-5 personal habits
And they set a personal inspiration prompt
Then a new member named "Johannes" should be added to the household
```

### Edge Case: A user tries to add a member with no name

```gherkin
Given the user is on the "Add Household Members" screen
When they try to add a member without providing a name
Then they should see an error message "Member name is required"
And the member should not be added
```

### Edge Case: A user tries to proceed without adding any members

```gherkin
Given the user has created a household
And they are on the "Add Household Members" screen
When they try to proceed without adding any members
Then they should see an error message "At least one member is required"
```

## Specification Quality Checklist

Before moving to /groundwork or /implement, verify:

### Requirement Completeness (Article VI)

- [ ] All `[NEEDS CLARIFICATION]` markers are resolved
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Each scenario has clear pass/fail conditions

### What vs. How Separation (Article VI.2)

- [ ] Spec focuses on WHAT users need and WHY
- [ ] No implementation details (tech stack, APIs, code structure)
- [ ] No prescriptive HOW (e.g., "use Redis", "create service class")
- [ ] Behaviors are described, not solutions

### Scenario Quality (Article VI.3)

- [ ] Each scenario is independently testable
- [ ] Scenarios are precise (no ambiguous terms)
- [ ] Scenarios are minimal (no unnecessary complexity)
- [ ] Happy path + key edge cases covered (2-4 scenarios)

### YAGNI Compliance (Article I.2)

- [ ] No speculative or "might need" features
- [ ] No future-proofing scenarios
- [ ] Only solving current, real problems

## Dependencies

- This feature depends on a household having been created first.

## Notes

- The process of defining personal habits will be detailed in a separate spec file to keep this one focused on adding members.

## Complexity Tracking

✅ No complexity exceptions required

## Production Learnings

---

_Generated: 2025-10-27_
_Next step: Review checklist, then run `/groundwork specs/users/add-household-members.md` (if DB changes) or `/implement specs/users/add-household-members.md`_
