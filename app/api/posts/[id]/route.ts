import type { NextRequest } from 'next/server';
import { ApiError, parseRequestBody, withAuthentication, withErrorHandling } from '@/lib/api/base';
import { withServices } from '@/lib/container/utils';

// GET /api/posts/[id] - Get single post (public)
export const GET = withErrorHandling(async (request: NextRequest, context) => {
  const { postService } = withServices('postService');
  const params = await context.params;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const post = await postService.getPostById(id);

  if (!post) {
    throw new ApiError(404, 'Post not found', 'POST_NOT_FOUND');
  }

  return post;
});

// PUT /api/posts/[id] - Update post (requires authentication + ownership)
export const PUT = withAuthentication(async (session, request, context) => {
  const { postService } = withServices('postService');
  const params = await context.params;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Authorization check
  const existingPost = await postService.getPostById(id);
  if (!existingPost) {
    throw new ApiError(404, 'Post not found', 'POST_NOT_FOUND');
  }

  if (existingPost.authorId !== session.user.id) {
    throw new ApiError(403, 'You do not have permission to edit this post', 'FORBIDDEN');
  }

  const body = await parseRequestBody<{
    title?: string;
    content?: string;
    published?: boolean;
  }>(request);

  const updatedPost = await postService.updatePost(id, body);

  return updatedPost;
});

// DELETE /api/posts/[id] - Delete post (requires authentication + ownership)
export const DELETE = withAuthentication(async (session, request, context) => {
  const { postService } = withServices('postService');
  const params = await context.params;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Authorization check
  const existingPost = await postService.getPostById(id);
  if (!existingPost) {
    throw new ApiError(404, 'Post not found', 'POST_NOT_FOUND');
  }

  if (existingPost.authorId !== session.user.id) {
    throw new ApiError(403, 'You do not have permission to delete this post', 'FORBIDDEN');
  }

  await postService.deletePost(id);

  return { message: 'Post deleted successfully' };
});
