# Implementation Patterns for AI Agents

This document provides specific technical patterns for AI agents implementing features in this codebase. These patterns prevent common errors and ensure consistency.

## Container & Services Pattern

### Using Services in API Routes

**ALWAYS** use services via `withServices()`. **NEVER** access database directly.

✅ **CORRECT:**

```typescript
import { withServices } from '@/lib/container/utils';
import { withAuth } from '@/lib/api/handlers';

export const POST = withAuth(async (session, request) => {
  const { userService, habitService } = withServices(
    'userService',
    'habitService'
  );

  const result = await userService.createUser(data);
  return result; // Returns Result<T>
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
- `emailService` - Email operations
- `workflowService` - Workflow operations
- `postService` - Post management operations
- `paymentService` - Payment processing operations

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

When implementing a service method, access the database through injected dependencies and return a `Result<T>`:

✅ **CORRECT:**

```typescript
import type { Result } from '@/lib/result';

export class PostService {
  constructor(private deps: ServiceDependencies) {}

  async getById(id: string): Promise<Result<Post>> {
    try {
      const [post] = await this.deps.db
        .select()
        .from(posts)
        .where(eq(posts.id, id));

      if (!post) {
        return {
          success: false,
          error: { code: 'POST_NOT_FOUND', message: 'Post not found' },
        };
      }

      return { success: true, data: post };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to fetch post',
          cause: error,
        },
      };
    }
  }
}
```

## Result Type Pattern

### Overview

The codebase uses an explicit `Result<T, E>` type for error handling instead of throwing exceptions. This makes error handling explicit and type-safe.

**File**: `lib/result.ts`

```typescript
import type { AppError } from './errors';

export type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };
```

### Usage in Services

Services return `Result<T>` instead of throwing:

✅ **CORRECT - Explicit Result:**

```typescript
async createPost(data: CreatePostInput, userId: string): Promise<Result<Post>> {
  try {
    const [post] = await this.deps.db
      .insert(posts)
      .values({ ...data, authorId: userId })
      .returning();

    return { success: true, data: post };
  } catch (error) {
    return {
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to create post', cause: error }
    };
  }
}
```

❌ **WRONG - Throwing exceptions (deprecated):**

```typescript
async createPost(data: CreatePostInput): Promise<Post> {
  const post = await this.deps.db.insert(posts).values(data).returning();
  if (!post) throw new ApiError(500, 'Failed to create post'); // ❌ Don't throw
  return post;
}
```

### Checking Results

```typescript
const result = await postService.getById(id);

if (!result.success) {
  // Handle error - result.error is AppError
  console.log(result.error.code, result.error.message);
  return result; // Can pass through in handlers
}

// Success - result.data is Post
const post = result.data;
```

## Error Handling Pattern

### Error Codes

**File**: `lib/errors.ts`

Centralized error codes with exhaustive HTTP status mapping:

```typescript
export const ErrorCode = {
  // Validation (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_JSON: 'INVALID_JSON',

  // Auth (401/403)
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Not Found (404)
  NOT_FOUND: 'NOT_FOUND',
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  PAYMENT_NOT_FOUND: 'PAYMENT_NOT_FOUND',

  // Server (500/502)
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;
```

### AppError Interface

```typescript
export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>; // Validation details for client
  cause?: unknown; // Original error for logging (not sent to client)
}
```

### Status Code Mapping

HTTP status codes are centralized and type-safe:

```typescript
export const errorCodeToStatus: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  INVALID_JSON: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  POST_NOT_FOUND: 404,
  // ... etc
};
```

### Adding New Error Codes

1. Add to `ErrorCode` object in `lib/errors.ts`
2. Add status mapping to `errorCodeToStatus`
3. TypeScript enforces completeness (compile error if mapping missing)

## API Route Handlers

### Overview

**File**: `lib/api/handlers.ts`

The codebase provides two handler wrappers that convert `Result<T>` to HTTP responses:

- `withHandler` - For public routes
- `withAuth` - For authenticated routes (checks session automatically)

### API Response Types

```typescript
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  code: string;
  error: string;
  details?: Record<string, unknown>;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### withAuth - Authenticated Routes

For routes requiring authentication:

```typescript
import { withAuth } from '@/lib/api/handlers';
import { withServices } from '@/lib/container/utils';

export const POST = withAuth(async (session, req, ctx) => {
  const { postService } = withServices('postService');

  // session.user.id is available
  return postService.createPost(data, session.user.id);
});
```

`withAuth` automatically:

- Checks for valid session
- Returns 401 if not authenticated
- Passes session, request, and context to handler
- Converts `Result<T>` to `NextResponse`

### withHandler - Public Routes

For routes not requiring authentication:

```typescript
import { withHandler } from '@/lib/api/handlers';
import { withServices } from '@/lib/container/utils';

export const GET = withHandler(async (req, ctx) => {
  const { postService } = withServices('postService');
  return postService.getPosts();
});
```

### handleResult - Manual Conversion

For edge cases where you need manual control:

```typescript
import { handleResult } from '@/lib/api/handlers';

const result = await postService.createPost(data);
return handleResult(result, 201); // Custom success status
```

## Zod Validation Pattern

### Overview

**File**: `lib/validation/parse.ts`

Request validation uses Zod schemas with helpers that return `Result<T>`:

### Schema Definition

Define schemas in `modules/{domain}/schemas.ts`:

```typescript
// modules/posts/schemas.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  content: z.string().min(1, 'Content required'),
  published: z.boolean().default(false),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
```

### Validating Request Body

```typescript
import { parseRequestBody } from '@/lib/validation/parse';
import { createPostSchema } from '@/modules/posts/schemas';

export const POST = withAuth(async (session, req) => {
  const bodyResult = await parseRequestBody(req, createPostSchema);
  if (!bodyResult.success) return bodyResult; // Returns validation error

  const { postService } = withServices('postService');
  return postService.createPost(bodyResult.data, session.user.id);
});
```

### Validating Search Params

```typescript
import { parseSearchParams } from '@/lib/validation/parse';

const paginationSchema = z.object({
  limit: z.coerce.number().optional().default(10),
  offset: z.coerce.number().optional().default(0),
  search: z.string().optional(),
});

export const GET = withHandler(async (req) => {
  const paramsResult = parseSearchParams(req.url, paginationSchema);
  if (!paramsResult.success) return paramsResult;

  const { postService } = withServices('postService');
  return postService.getPosts(paramsResult.data);
});
```

### Generic Validation

```typescript
import { parseWith } from '@/lib/validation/parse';

const result = parseWith(mySchema, someData);
if (!result.success) {
  // result.error.details.issues contains validation errors
}
```

## TanStack Query Pattern

### Overview

Client-side data fetching uses TanStack Query (React Query) for caching, refetching, and mutations.

**Location**: `modules/{domain}/hooks/use-{entity}.ts`

### API Helper

```typescript
// modules/posts/hooks/use-posts.ts
'use client';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}
```

### Query Hooks (Read)

```typescript
export function usePosts(filters?: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.limit) params.set('limit', String(filters.limit));

  const queryString = params.toString();
  const url = queryString ? `/api/posts?${queryString}` : '/api/posts';

  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => fetchApi<Post[]>(url),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchApi<Post>(`/api/posts/${id}`),
    enabled: !!id,
  });
}
```

### Mutation Hooks (Create/Update/Delete)

```typescript
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostInput) =>
      fetchApi<Post>('/api/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdatePostInput & { id: string }) =>
      fetchApi<Post>(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<void>(`/api/posts/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
}
```

### Using Hooks in Components

```typescript
'use client';

import { usePosts, useCreatePost } from '@/modules/posts/hooks/use-posts';

export function PostList() {
  const { data: posts, isLoading, error } = usePosts({ limit: 10 });
  const createPost = useCreatePost();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async () => {
    await createPost.mutateAsync({ title: 'New Post', content: '...' });
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={createPost.isPending}>
        {createPost.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {posts?.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
```

## Next.js 15+ Patterns

### Route Params are Promises

In Next.js 15+, `context.params` is a **Promise** and must be awaited.

✅ **CORRECT:**

```typescript
export const GET = withAuth(async (session, request, context) => {
  // MUST await context.params in Next.js 15+
  const params = await context.params;
  const id = params?.id as string;

  if (!id) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'ID is required' },
    };
  }

  const { postService } = withServices('postService');
  return postService.getById(id);
});
```

❌ **WRONG:**

```typescript
export const GET = withAuth(async (session, request, context) => {
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
// app/api/posts/route.ts
import { withAuth, withHandler } from '@/lib/api/handlers';
import { parseRequestBody, parseSearchParams } from '@/lib/validation/parse';
import { withServices } from '@/lib/container/utils';
import { createPostSchema } from '@/modules/posts/schemas';
import { z } from 'zod';

const listQuerySchema = z.object({
  limit: z.coerce.number().optional().default(10),
  offset: z.coerce.number().optional().default(0),
  search: z.string().optional(),
});

// GET /api/posts - Public route
export const GET = withHandler(async (req) => {
  const paramsResult = parseSearchParams(req.url, listQuerySchema);
  if (!paramsResult.success) return paramsResult;

  const { postService } = withServices('postService');
  return postService.getPosts(paramsResult.data);
});

// POST /api/posts - Authenticated route
export const POST = withAuth(async (session, req) => {
  const bodyResult = await parseRequestBody(req, createPostSchema);
  if (!bodyResult.success) return bodyResult;

  const { postService } = withServices('postService');
  return postService.createPost(bodyResult.data, session.user.id);
});
```

```typescript
// app/api/posts/[id]/route.ts
import { withAuth } from '@/lib/api/handlers';
import { parseRequestBody } from '@/lib/validation/parse';
import { withServices } from '@/lib/container/utils';
import { updatePostSchema } from '@/modules/posts/schemas';

// GET /api/posts/[id]
export const GET = withAuth(async (session, req, ctx) => {
  const params = await ctx.params;
  const id = params?.id as string;

  const { postService } = withServices('postService');
  return postService.getById(id);
});

// PUT /api/posts/[id]
export const PUT = withAuth(async (session, req, ctx) => {
  const params = await ctx.params;
  const id = params?.id as string;

  const bodyResult = await parseRequestBody(req, updatePostSchema);
  if (!bodyResult.success) return bodyResult;

  const { postService } = withServices('postService');
  return postService.updatePost(id, bodyResult.data, session.user.id);
});

// DELETE /api/posts/[id]
export const DELETE = withAuth(async (session, req, ctx) => {
  const params = await ctx.params;
  const id = params?.id as string;

  const { postService } = withServices('postService');
  return postService.deletePost(id, session.user.id);
});
```

## Testing Patterns

### Using Test Container

In tests, use the test container with test database:

```typescript
import { createTestContainer } from '@/tests/utils/test-container';
import {
  setupTestDatabase,
  cleanupTestDatabase,
} from '@/tests/utils/test-database';

describe('PostService', () => {
  let container: Container;
  let postService: PostService;

  beforeAll(async () => {
    await setupTestDatabase();
    container = createTestContainer();
    postService = container.postService;
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should create post', async () => {
    const result = await postService.createPost(
      { title: 'Test', content: 'Content', published: false },
      'user-123'
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Test');
    }
  });

  it('should return error for non-existent post', async () => {
    const result = await postService.getById('non-existent-id');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('POST_NOT_FOUND');
    }
  });
});
```

## Migration Guide: Old vs New Patterns

| Aspect          | Before (Deprecated)                               | After (Current)                               |
| --------------- | ------------------------------------------------- | --------------------------------------------- |
| Error handling  | `throw new ApiError(...)`                         | `return { success: false, error: {...} }`     |
| Validation      | `parseRequestBody()` + `validateRequiredFields()` | Zod schemas + `parseRequestBody(req, schema)` |
| Service returns | `T` (throws on error)                             | `Result<T>` (explicit)                        |
| API handlers    | `withErrorHandling` + `withAuthentication`        | `withHandler` + `withAuth`                    |
| Status codes    | Scattered in `ApiError` calls                     | Centralized `errorCodeToStatus`               |
| Client fetching | `useState` + `useEffect` + `fetch`                | TanStack Query hooks                          |
| Reference file  | `lib/api/base.ts`                                 | `lib/api/handlers.ts`                         |

## Common Pitfalls Summary

### ❌ What NOT to Do

1. **Never access `db` directly via `withServices('db')`** - db is not a service
2. **Never throw errors in services** - return `Result<T>` instead
3. **Never access `context.params.id` without await** - params is a Promise in Next.js 15+
4. **Never use direct database queries in API routes** - use services instead
5. **Never use `ApiError` class** - use `Result<T>` with error codes instead
6. **Never use `withErrorHandling` or `withAuthentication`** - use `withHandler` or `withAuth`

### ✅ What to Do

1. **Always use `withServices()` to access services** in API routes
2. **Always return `Result<T>` from service methods** - explicit success/error
3. **Always await `context.params`** in Next.js 15+ dynamic routes
4. **Always validate with Zod schemas** - use `parseRequestBody` and `parseSearchParams`
5. **Always use TanStack Query** for client-side data fetching
6. **Always add new error codes** to `ErrorCode` and `errorCodeToStatus`

## Constitutional Compliance

These patterns align with the Constitutional BDD principles:

- **Article I (Simplicity First)**: Use framework patterns directly, minimal abstractions
- **Article II (Anti-Abstraction)**: Services encapsulate logic, not wrapper layers
- **Article III (Integration-First Testing)**: Test with real database via test container
- **Article IV (Test-First)**: Write tests using these patterns before implementation

Note: The `Result<T,E>` type is **not** an abstraction layer - it's explicit error handling that makes success/failure states visible in the type system. This aligns with Article II which values clarity over hidden control flow.

## Reference Implementation

For complete working examples, see:

- `app/api/posts/route.ts` - GET (public) and POST (authenticated) with Zod validation
- `app/api/posts/[id]/route.ts` - Dynamic route with params handling
- `modules/posts/services/post.service.ts` - Service with Result<T> returns
- `modules/posts/hooks/use-posts.ts` - TanStack Query hooks
- `modules/posts/schemas.ts` - Zod schema definitions
- `lib/api/handlers.ts` - API handler utilities
- `lib/result.ts` - Result type definition
- `lib/errors.ts` - Error codes and status mapping
- `lib/validation/parse.ts` - Zod validation helpers

---

**Last Updated**: Based on functional programming patterns with Result<T>, TanStack Query, and Zod validation.
