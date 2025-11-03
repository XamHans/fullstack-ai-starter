# Implementation Patterns for AI Agents

This document provides specific technical patterns for AI agents implementing features in this codebase. These patterns prevent common errors and ensure consistency.

## Container & Services Pattern

### Using Services in API Routes

**ALWAYS** use services via `withServices()`. **NEVER** access database directly.

✅ **CORRECT:**
```typescript
import { withServices } from '@/lib/container/utils';

export const POST = withErrorHandling(async (request, context, logger) => {
  const { userService, habitService } = withServices('userService', 'habitService');

  const result = await userService.createUser(data);
  return { user: result };
});
```

❌ **WRONG - Will throw "db does not exist in Services" error:**
```typescript
// DO NOT DO THIS
const { db } = withServices('db'); // ❌ db is NOT a service!

// DO NOT DO THIS
const container = getContainer();
const db = container.database.db; // ❌ Never access db directly in API routes
```

### Available Services

You can access these services via `withServices()`:
- `userService` - User management operations
- `habitService` - Habit tracking operations
- `householdService` - Household management
- `emailService` - Email operations
- `workflowService` - Workflow operations
- `specSyncService` - Spec synchronization
- `specGeneratorService` - Spec generation

### NOT Available as Services

These are infrastructure, not services:
- ❌ `db` - Use services instead
- ❌ `database` - Use services instead
- ❌ `externalServices` - Use services instead

### Why This Matters

The architecture follows the **Anti-Abstraction Principle** (Constitution Article II) where:
- **Services** encapsulate business logic and database operations
- **API Routes** use services, never direct database access
- **Services** receive dependencies via constructor injection

### Service Implementation Pattern

When implementing a service method, access the database through injected dependencies:

✅ **CORRECT:**
```typescript
export class UserService {
  constructor(private deps: ServiceDependencies) {}

  private get logger() {
    return this.deps.logger.child({ service: 'UserService' });
  }

  async getUserById(id: string) {
    // Access db through this.deps.db
    const [user] = await this.deps.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user;
  }
}
```

## API Response Pattern

### Auto-Wrapped Responses

When using `withErrorHandling`, return **data objects directly**. Do NOT return `NextResponse`.

The `withErrorHandling` wrapper automatically wraps your return value as:
```json
{
  "success": true,
  "data": { /* your return value */ }
}
```

✅ **CORRECT:**
```typescript
export const POST = withErrorHandling(async (request, context, logger) => {
  const user = await userService.createUser(data);

  // Return data directly - it gets auto-wrapped
  return { user }; // ✅ Becomes { success: true, data: { user } }
});
```

❌ **WRONG:**
```typescript
export const POST = withErrorHandling(async (request, context, logger) => {
  const user = await userService.createUser(data);

  // Don't manually wrap!
  return NextResponse.json({ success: true, data: { user } }); // ❌ Double wrapping!
});
```

### Frontend Response Handling

Because responses are wrapped, frontend code should handle both formats:

```typescript
const response = await fetch('/api/endpoint');
const result = await response.json();

// Handle both wrapped and unwrapped responses
const data = result.data || result;
```

### Error Responses

Errors thrown inside `withErrorHandling` are automatically formatted as:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Use `ApiError` for controlled errors:
```typescript
import { ApiError } from '@/lib/api/base';

if (!userId) {
  throw new ApiError(400, 'User ID is required', 'MISSING_USER_ID');
}
```

## Next.js 15+ Patterns

### Route Params are Promises

In Next.js 15+, `context.params` is a **Promise** and must be awaited.

✅ **CORRECT:**
```typescript
export const GET = withErrorHandling(async (request, context, logger) => {
  // MUST await context.params in Next.js 15+
  const params = await context.params;
  const id = params?.id as string;

  if (!id) {
    throw new ApiError(400, 'ID is required', 'MISSING_ID');
  }

  // ... rest of handler
});
```

❌ **WRONG:**
```typescript
export const GET = withErrorHandling(async (request, context, logger) => {
  // This will be undefined in Next.js 15+!
  const id = context.params.id; // ❌ Not awaited
});
```

### Search Params Pattern

Similarly, use `useSearchParams` hook properly in client components:

```typescript
'use client';

import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const index = parseInt(searchParams.get('index') || '0');

  // ... component logic
}
```

## Complete API Route Template

Here's a complete example showing all patterns together:

```typescript
// app/api/households/[id]/members/route.ts
import type { NextRequest } from 'next/server';
import {
  ApiError,
  parseRequestBody,
  validateRequiredFields,
  withErrorHandling,
} from '@/lib/api/base';
import { withServices } from '@/lib/container/utils';

interface CreateMemberRequest {
  name: string;
  role?: string;
}

export const POST = withErrorHandling(async (request: NextRequest, context, logger) => {
  // ✅ 1. Use services via withServices
  const { userService, householdService } = withServices('userService', 'householdService');

  // ✅ 2. Await context.params for Next.js 15+
  const params = await context.params;
  const householdId = params?.id as string;

  if (!householdId) {
    throw new ApiError(400, 'Household ID required', 'MISSING_ID');
  }

  logger?.info('Creating household member', {
    operation: 'createMember',
    householdId,
  });

  // Parse and validate request body
  const body = await parseRequestBody<CreateMemberRequest>(request);
  validateRequiredFields(body, ['name']);

  try {
    // Call service method
    const member = await userService.createHouseholdMember({
      householdId,
      name: body.name,
      role: body.role,
    });

    logger?.info('Member created successfully', {
      operation: 'createMember',
      memberId: member.id,
    });

    // ✅ 3. Return data directly (NOT NextResponse)
    // This gets auto-wrapped as { success: true, data: { member } }
    return { member };

  } catch (error) {
    logger?.error('Failed to create member');

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      `Failed to create member: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'CREATE_FAILED',
    );
  }
});
```

## Testing Patterns

### Using Test Container

In tests, use the test container with test database:

```typescript
import { createTestContainer } from '@/tests/utils/test-container';
import { setupTestDatabase, cleanupTestDatabase } from '@/tests/utils/test-database';

describe('UserService', () => {
  let container: Container;
  let userService: UserService;

  beforeAll(async () => {
    await setupTestDatabase();
    container = createTestContainer();
    userService = container.userService;
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should create user', async () => {
    const user = await userService.createUser({
      email: 'test@example.com',
      name: 'Test User',
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

## Common Pitfalls Summary

### ❌ What NOT to Do

1. **Never access `db` directly via `withServices('db')`** - db is not a service
2. **Never return `NextResponse.json()` from `withErrorHandling` handlers** - responses are auto-wrapped
3. **Never access `context.params.id` without await** - params is a Promise in Next.js 15+
4. **Never use direct database queries in API routes** - use services instead
5. **Never skip logger calls** - logging is essential for debugging

### ✅ What to Do

1. **Always use `withServices()` to access services** in API routes
2. **Always return plain data objects** from `withErrorHandling` handlers
3. **Always await `context.params`** in Next.js 15+ dynamic routes
4. **Always implement business logic in services**, not API routes
5. **Always log important operations** with context

## Constitutional Compliance

These patterns align with the Constitutional BDD principles:

- **Article I (Simplicity First)**: Use framework patterns directly, minimal abstractions
- **Article II (Anti-Abstraction)**: Services encapsulate logic, not wrapper layers
- **Article III (Integration-First Testing)**: Test with real database via test container
- **Article IV (Test-First)**: Write tests using these patterns before implementation

## Reference Implementation

For complete working examples, see:
- `app/api/households/[id]/users/route.ts` - GET with dynamic params
- `app/api/onboarding/users/route.ts` - POST with service usage
- `app/api/onboarding/save-preferences/route.ts` - Complex data handling
- `modules/users/services/user.service.ts` - Service implementation
- `modules/habits/services/habit-service.ts` - Service with business logic

---

**Last Updated**: Based on learnings from Next.js 15+ migration and container pattern implementation.
