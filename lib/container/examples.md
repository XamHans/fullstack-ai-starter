# Container Dependency Injection - Usage Examples

This document demonstrates the improved dependency injection patterns and shows how to use the new container system effectively.

## Basic Service Access Patterns

### 1. Simple Service Destructuring (Recommended)

```typescript
// API Route Example
import { withServices } from "@/lib/container/utils";

export const GET = async (request: NextRequest) => {
  // Clean destructuring - only get what you need
  const { postService } = withServices('postService');

  const posts = await postService.getPosts();
  return posts;
};
```

### 2. Multiple Services

```typescript
// When you need multiple services
import { withServices } from "@/lib/container/utils";

export const POST = async (request: NextRequest) => {
  const { postService, userService } = withServices('postService', 'userService');

  const user = await userService.getUserById(authorId);
  const post = await postService.createPost(data, user.id);

  return post;
};
```

### 3. Single Service Access

```typescript
// For single service operations
import { withService } from "@/lib/container/utils";

export const DELETE = async (request: NextRequest) => {
  const postService = withService('postService');

  await postService.deletePost(id);
  return { success: true };
};
```

## Advanced Patterns

### 4. Hook-like Pattern with useServices

```typescript
// More React-like API
import { useServices } from "@/lib/container/utils";

export const handler = async () => {
  // Get all services
  const { userService, postService } = useServices.all();

  // Or pick specific ones
  const { postService } = useServices.pick('postService');

  // Or get a single service
  const userService = useServices.get('userService');
};
```

### 5. Container Context Pattern

```typescript
// For complex operations needing full container access
import { withContainer } from "@/lib/container/utils";

export const complexOperation = async () => {
  return withContainer(async (container) => {
    // Access to full container
    const { userService, postService } = container;
    const database = container.database;

    // Complex multi-service operation
    const user = await userService.getUserById(id);
    const posts = await postService.getPostsByAuthor(user.id);

    return { user, posts };
  });
};
```

## Service Composition Patterns

### 6. Cross-Service Operations

```typescript
// Inside PostService - accessing other services
export class PostService {
  constructor(private deps: ServiceDependencies) {}

  protected get userService() {
    return this.services?.userService;
  }

  async createPostWithUserValidation(data: CreatePostInput, authorId: string) {
    // Validate user exists using the user service
    const user = await this.userService?.getUserById(authorId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.createPost(data, authorId);
  }
}
```

## Error Handling Patterns

### 7. Service Operation Wrapper

```typescript
import { serviceOperation } from "@/lib/container/utils";

export const safeUserOperation = async () => {
  try {
    return await serviceOperation('userService', 'createUser', async (userService) => {
      return userService.createUser({
        email: 'test@example.com',
        name: 'Test User',
        provider: 'google',
        providerId: '123'
      });
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.log(`Service: ${error.serviceName}, Operation: ${error.operation}`);
      console.log('Context:', error.context);
    }
    throw error;
  }
};
```

## Testing Patterns

### 8. Service Mocking

```typescript
import { createServiceMock } from "@/lib/container/utils";
import { setContainer, createContainer } from "@/lib/container";

// Create mock services for testing
const mockUserService = createServiceMock('userService', {
  getUserById: vi.fn().mockResolvedValue({ id: '1', email: 'test@example.com' }),
  createUser: vi.fn().mockResolvedValue({ id: '1', email: 'test@example.com' })
});

// Use in test container
const testContainer = createContainer({
  database: mockDatabase,
  userService: mockUserService.userService
});

setContainer(testContainer);
```

### 9. Type-Safe Service Access in Tests

```typescript
describe('API Tests', () => {
  it('should use services correctly', () => {
    const container = createTestContainer();

    // Direct access with type safety
    expect(container.userService).toBeDefined();
    expect(container.postService).toBeDefined();

    // Use the same patterns as production code
    const { userService } = withServices('userService');
    expect(userService).toBe(container.userService);
  });
});
```

## Migration from Old Pattern

### Before (Old Pattern)
```typescript
// Old verbose approach
export const GET = async (request: NextRequest) => {
  const container = getContainer();
  const postService = container.businessServices.postService;

  const posts = await postService.getPosts();
  return posts;
};
```

### After (New Pattern)
```typescript
// New clean approach
export const GET = async (request: NextRequest) => {
  const { postService } = withServices('postService');

  const posts = await postService.getPosts();
  return posts;
};
```

## Performance Considerations

- **Service Caching**: The container maintains a singleton pattern for services
- **Lazy Loading**: Services are only instantiated when the container is created
- **Type Safety**: All service access is fully typed with TypeScript
- **Memory Efficiency**: No additional overhead compared to the previous pattern

## Best Practices

1. **Use `withServices()` for most cases** - it provides the cleanest API
2. **Destructure only what you need** - don't extract all services if you only need one
3. **Use `withService()` for single service operations** - slightly more efficient
4. **Prefer composition over container access** - let services access other services through their dependencies
5. **Use the error handling utilities** - they provide better debugging information
6. **Keep service operations focused** - each service should have a single responsibility

## Type Safety Features

The new container system provides:

- **Autocompletion** for service names
- **Type inference** for service methods and properties
- **Compile-time checking** for service availability
- **IntelliSense support** in modern IDEs

```typescript
// Full type safety
const { postService } = withServices('postService'); // ✅ Typed
const posts = await postService.getPosts(); // ✅ Method is typed
const invalid = withServices('invalidService'); // ❌ Compile error
```