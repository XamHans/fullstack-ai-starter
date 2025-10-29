# Weekly Meal Planning

## Context

This feature is a cornerstone of the app, designed to simplify the user's life by planning a week's worth of meals in a fun and engaging way. It uses a Tinder-style swipe interface for recipe selection and automatically generates a consolidated grocery list.

## Domain

`modules/meal-planning/`

## Implementation Progress

<!-- Track scenario implementation below -->

⏳ All scenarios pending

## Uncertainties



✅ No ambiguities - all requirements are clear and testable



## Scenarios



### Happy Path: A user plans a week of meals

```gherkin

Given a user starts the weekly meal planning

When they swipe right on 14 different recipes

Then a meal plan for the week should be created

And a grocery list should be automatically generated

And the user should be shown the meal plan in a calendar view

```



### Happy Path: Grocery list ingredients are consolidated by name

```gherkin

Given a user has selected a recipe needing "2 onions"

And they select another recipe needing "1 onion"

When the grocery list is generated

Then it should contain a single entry for "Onions" with a quantity of "3"

```



### Happy Path: A user manually adds an item to the grocery list

```gherkin

Given a grocery list has been generated

When the user adds "Coffee beans" to the list

Then the grocery list should contain "Coffee beans"

```



### Edge Case: Consolidating ingredients with different units

```gherkin

Given a user has selected a recipe needing "1 cup of flour"

And they select another recipe needing "200g of flour"

When the grocery list is generated

Then it should contain two separate entries for flour: "Flour: 1 cup" and "Flour: 200g"

```



### Edge Case: AI fails to provide new recipes

```gherkin

Given a user is swiping through recipes

And the AI service fails to generate a new recipe

Then the user should see an error message "Could not load new recipes, please try again"

And they should be given the option to restart the planning process

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

- This feature depends on household and user profiles (with dietary preferences) already being set up.
- This feature has a dependency on an external AI service for recipe generation.

## Notes

- The user experience for the Tinder-style swipe is critical and should be smooth and responsive.
- The logic for consolidating the grocery list is a key part of this feature's value.

## Complexity Tracking

✅ No complexity exceptions required

## Production Learnings

---

_Generated: 2025-10-27_
_Next step: Review checklist, then run `/groundwork specs/meal-planning/weekly-meal-planning.md` (if DB changes) or `/implement specs/meal-planning/weekly-meal-planning.md`_
