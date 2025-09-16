import type { NextRequest } from 'next/server';
import {
  ApiError,
  getQueryParams,
  parseRequestBody,
  validateRequiredFields,
  withAuthentication,
  withErrorHandling,
} from '@/lib/api/base';
import { withServices } from '@/lib/container/utils';

// GET /api/posts - List posts (public)
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { postService } = withServices('postService');

  const { limit, offset, search } = getQueryParams(request);

  const posts = await postService.getPosts({
    limit,
    offset,
    search,
  });

  return posts;
});

// POST /api/posts - Create post (requires authentication)
export const POST = withAuthentication(async (session, request) => {
  const { postService } = withServices('postService');

  const body = await parseRequestBody<{
    title: string;
    content: string;
    published?: boolean;
  }>(request);

  validateRequiredFields(body, ['title', 'content']);

  const post = await postService.createPost(body, session.user.id);

  return post;
});
