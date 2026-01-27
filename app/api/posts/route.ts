import { withAuth, withHandler } from '@/lib/api/handlers';
import { parseRequestBody, parseSearchParams } from '@/lib/validation/parse';
import { createPostSchema, getPostsQuerySchema } from '@/modules/posts/schemas';
import { withServices } from '@/lib/container/utils';

// GET /api/posts - List posts (public)
export const GET = withHandler(async (req) => {
  const paramsResult = parseSearchParams(req.url, getPostsQuerySchema);
  if (!paramsResult.success) return paramsResult;

  const { postService } = withServices('postService');
  return postService.getPosts(paramsResult.data);
});

// POST /api/posts - Create post (requires authentication)
export const POST = withAuth(async (session, req) => {
  const bodyResult = await parseRequestBody(req, createPostSchema);
  if (!bodyResult.success) return bodyResult;

  const { postService } = withServices('postService');
  return postService.createPost(bodyResult.data, session.user.id);
});
