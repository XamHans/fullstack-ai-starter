import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestContainer } from '@/tests/utils/test-container';
import {
  cleanTestDatabase,
  setupTestDatabase,
  teardownTestDatabase,
} from '@/tests/utils/test-database';
import type { PostService } from '../services/post.service';

describe('PostService', () => {
  let postService: PostService;
  let testContainer: ReturnType<typeof createTestContainer>;

  beforeAll(async () => {
    try {
      await setupTestDatabase();
    } catch (error) {
      console.warn('Docker not available, using mock database');
    }
  });

  afterAll(async () => {
    try {
      await teardownTestDatabase();
    } catch (error) {
      // Ignore teardown errors when using mock database
    }
  });

  beforeEach(async () => {
    try {
      await cleanTestDatabase();
    } catch (error) {
      // Ignore cleanup errors when using mock database
    }
    testContainer = createTestContainer();
    postService = testContainer.postService;
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is a test post content',
        published: false,
      };
      const authorId = 'test-author-id';

      const post = await postService.createPost(postData, authorId);

      expect(post).toMatchObject({
        title: postData.title,
        content: postData.content,
        published: postData.published,
        authorId: authorId,
      });
      expect(post.id).toBeDefined();
      expect(post.createdAt).toBeDefined();
      expect(post.updatedAt).toBeDefined();
    });

    it('should create a published post', async () => {
      const postData = {
        title: 'Published Test Post',
        content: 'This is a published test post',
        published: true,
      };
      const authorId = 'test-author-id';

      const post = await postService.createPost(postData, authorId);

      expect(post.published).toBe(true);
      expect(post.title).toBe(postData.title);
      expect(post.authorId).toBe(authorId);
    });
  });

  describe('getPostById', () => {
    it('should find post by id', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is a test post content',
        published: true,
      };
      const authorId = 'test-author-id';

      const createdPost = await postService.createPost(postData, authorId);
      const foundPost = await postService.getPostById(createdPost.id);

      expect(foundPost).toMatchObject({
        id: createdPost.id,
        title: postData.title,
        content: postData.content,
        published: postData.published,
        authorId: authorId,
      });
    });

    it('should return undefined for non-existent post', async () => {
      const foundPost = await postService.getPostById('non-existent-id');
      expect(foundPost).toBeUndefined();
    });
  });

  describe('updatePost', () => {
    it('should update post title and content', async () => {
      const postData = {
        title: 'Original Title',
        content: 'Original content',
        published: false,
      };
      const authorId = 'test-author-id';

      const createdPost = await postService.createPost(postData, authorId);

      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const updatedPost = await postService.updatePost(createdPost.id, updateData);

      expect(updatedPost).toMatchObject({
        id: createdPost.id,
        title: updateData.title,
        content: updateData.content,
        published: false,
        authorId: authorId,
      });
      expect(updatedPost.updatedAt).not.toEqual(createdPost.updatedAt);
    });

    it('should update only published status', async () => {
      const postData = {
        title: 'Test Post',
        content: 'Test content',
        published: false,
      };
      const authorId = 'test-author-id';

      const createdPost = await postService.createPost(postData, authorId);

      const updateData = {
        published: true,
      };

      const updatedPost = await postService.updatePost(createdPost.id, updateData);

      expect(updatedPost).toMatchObject({
        id: createdPost.id,
        title: postData.title,
        content: postData.content,
        published: true,
        authorId: authorId,
      });
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const postData = {
        title: 'Post to Delete',
        content: 'This post will be deleted',
        published: true,
      };
      const authorId = 'test-author-id';

      const createdPost = await postService.createPost(postData, authorId);

      await postService.deletePost(createdPost.id);

      const foundPost = await postService.getPostById(createdPost.id);
      expect(foundPost).toBeUndefined();
    });
  });

  describe('getPosts', () => {
    beforeEach(async () => {
      // Create some test posts
      const authorId = 'test-author-id';

      await postService.createPost(
        {
          title: 'Published Post 1',
          content: 'Content 1',
          published: true,
        },
        authorId,
      );

      await postService.createPost(
        {
          title: 'Published Post 2',
          content: 'Content 2',
          published: true,
        },
        authorId,
      );

      await postService.createPost(
        {
          title: 'Draft Post',
          content: 'Draft content',
          published: false,
        },
        authorId,
      );
    });

    it('should return only published posts by default', async () => {
      const posts = await postService.getPosts();

      expect(posts).toHaveLength(2);
      posts.forEach((post) => {
        expect(post.published).toBe(true);
      });
    });

    it('should respect limit parameter', async () => {
      const posts = await postService.getPosts({ limit: 1 });

      expect(posts).toHaveLength(1);
      expect(posts[0].published).toBe(true);
    });

    it('should respect offset parameter', async () => {
      const posts = await postService.getPosts({ limit: 1, offset: 1 });

      expect(posts).toHaveLength(1);
      expect(posts[0].published).toBe(true);
    });

    it('should filter by search term', async () => {
      const posts = await postService.getPosts({ search: 'Post 1' });

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Published Post 1');
    });

    it('should filter by author id', async () => {
      const otherAuthorId = 'other-author-id';

      await postService.createPost(
        {
          title: 'Other Author Post',
          content: 'Content by other author',
          published: true,
        },
        otherAuthorId,
      );

      const posts = await postService.getPosts({ authorId: otherAuthorId });

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Other Author Post');
      expect(posts[0].authorId).toBe(otherAuthorId);
    });
  });

  describe('getPostsByAuthor', () => {
    it('should return posts by specific author', async () => {
      const authorId = 'test-author-id';
      const otherAuthorId = 'other-author-id';

      await postService.createPost(
        {
          title: 'Author 1 Post 1',
          content: 'Content 1',
          published: true,
        },
        authorId,
      );

      await postService.createPost(
        {
          title: 'Author 1 Post 2',
          content: 'Content 2',
          published: false,
        },
        authorId,
      );

      await postService.createPost(
        {
          title: 'Author 2 Post',
          content: 'Content by author 2',
          published: true,
        },
        otherAuthorId,
      );

      const posts = await postService.getPostsByAuthor(authorId);

      expect(posts).toHaveLength(1); // Only published post
      expect(posts[0].title).toBe('Author 1 Post 1');
      expect(posts[0].authorId).toBe(authorId);
    });

    it('should include unpublished posts when specified', async () => {
      const authorId = 'test-author-id';

      await postService.createPost(
        {
          title: 'Published Post',
          content: 'Published content',
          published: true,
        },
        authorId,
      );

      await postService.createPost(
        {
          title: 'Draft Post',
          content: 'Draft content',
          published: false,
        },
        authorId,
      );

      const posts = await postService.getPostsByAuthor(authorId, true);

      expect(posts).toHaveLength(2);
      expect(posts.some((p) => p.published)).toBe(true);
      expect(posts.some((p) => !p.published)).toBe(true);
    });
  });
});
