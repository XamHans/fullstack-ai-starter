import { and, desc, eq, ilike } from 'drizzle-orm';
import type { ServiceDependencies } from '@/lib/container/types';
import { posts } from '../schema';
import type { CreatePostInput, PostFilters, UpdatePostInput } from '../types';

export class PostService {
  constructor(private deps: ServiceDependencies) {}

  private get logger() {
    return this.deps.logger.child({ service: 'PostService' });
  }

  // Service composition helpers
  protected get services() {
    return this.deps.services;
  }

  protected get userService() {
    return this.services?.userService;
  }

  async createPost(data: CreatePostInput, authorId: string) {
    this.logger.info('Creating new post', {
      operation: 'createPost',
      authorId,
      title: data.title,
      published: data.published ?? false,
    });

    try {
      const [post] = await this.deps.db
        .insert(posts)
        .values({
          ...data,
          authorId,
        })
        .returning();

      this.logger.info('Post created successfully', {
        operation: 'createPost',
        postId: post.id,
        authorId,
        title: data.title,
      });

      return post;
    } catch (error) {
      this.logger.error('Failed to create post', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'createPost',
          authorId,
          title: data.title,
        },
      });
      throw error;
    }
  }

  async getPostById(id: string) {
    this.logger.debug('Retrieving post by ID', {
      operation: 'getPostById',
      postId: id,
    });

    try {
      const [post] = await this.deps.db.select().from(posts).where(eq(posts.id, id));

      this.logger.debug(post ? 'Post found' : 'Post not found', {
        operation: 'getPostById',
        postId: id,
        found: !!post,
      });

      return post;
    } catch (error) {
      this.logger.error('Failed to retrieve post by ID', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'getPostById',
          postId: id,
        },
      });
      throw error;
    }
  }

  async updatePost(id: string, data: UpdatePostInput) {
    this.logger.info('Updating post', {
      operation: 'updatePost',
      postId: id,
      fieldsToUpdate: Object.keys(data),
    });

    try {
      const [post] = await this.deps.db
        .update(posts)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(posts.id, id))
        .returning();

      this.logger.info('Post updated successfully', {
        operation: 'updatePost',
        postId: id,
        fieldsUpdated: Object.keys(data),
      });

      return post;
    } catch (error) {
      this.logger.error('Failed to update post', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'updatePost',
          postId: id,
          fieldsToUpdate: Object.keys(data),
        },
      });
      throw error;
    }
  }

  async deletePost(id: string) {
    this.logger.info('Deleting post', {
      operation: 'deletePost',
      postId: id,
    });

    try {
      await this.deps.db.delete(posts).where(eq(posts.id, id));

      this.logger.info('Post deleted successfully', {
        operation: 'deletePost',
        postId: id,
      });
    } catch (error) {
      this.logger.error('Failed to delete post', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'deletePost',
          postId: id,
        },
      });
      throw error;
    }
  }

  async getPosts(filters: PostFilters = {}) {
    const { limit = 20, offset = 0, search, authorId } = filters;

    this.logger.debug('Retrieving posts with filters', {
      operation: 'getPosts',
      limit,
      offset,
      hasSearch: !!search,
      hasAuthorFilter: !!authorId,
    });

    try {
      const query = this.deps.db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.published, true),
            search ? ilike(posts.title, `%${search}%`) : undefined,
            authorId ? eq(posts.authorId, authorId) : undefined,
          ),
        )
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      const result = await query;

      this.logger.debug('Posts retrieved successfully', {
        operation: 'getPosts',
        count: result.length,
        limit,
        offset,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to retrieve posts', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'getPosts',
          filters,
        },
      });
      throw error;
    }
  }

  async getPostsByAuthor(authorId: string, includeUnpublished = false) {
    this.logger.debug('Retrieving posts by author', {
      operation: 'getPostsByAuthor',
      authorId,
      includeUnpublished,
    });

    try {
      const result = await this.deps.db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.authorId, authorId),
            includeUnpublished ? undefined : eq(posts.published, true),
          ),
        )
        .orderBy(desc(posts.createdAt));

      this.logger.debug('Author posts retrieved successfully', {
        operation: 'getPostsByAuthor',
        authorId,
        count: result.length,
        includeUnpublished,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to retrieve posts by author', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'getPostsByAuthor',
          authorId,
          includeUnpublished,
        },
      });
      throw error;
    }
  }
}
