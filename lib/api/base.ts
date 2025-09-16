// lib/api/base.ts

import type { Session } from 'better-auth';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { CustomLogger } from '@/lib/logger';
import { createRequestLogger } from '@/lib/logger';
import { getOrCreateCorrelationId } from './correlation';

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Function to create a standardized success response
export function createApiResponse<T>(
  data?: T,
  message?: string,
  statusCode = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: statusCode },
  );
}

// Function to create a standardized error response
export function createApiError(
  error: string | Error,
  statusCode = 500,
  code?: string,
): NextResponse<ApiResponse> {
  const message = error instanceof Error ? error.message : error;

  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
    },
    { status: statusCode },
  );
}

// Type for our authenticated API handlers
export type AuthenticatedApiHandler<T = any> = (
  session: Session,
  req: NextRequest,
  params?: { [key: string]: string | string[] },
  logger?: CustomLogger,
) => Promise<T>;

// Higher-order function to handle errors and authentication
export function withErrorHandling<T>(
  handler: (
    req: NextRequest,
    params?: { [key: string]: string | string[] },
    logger?: CustomLogger,
  ) => Promise<T>,
): (
  req: NextRequest,
  params?: { [key: string]: string | string[] },
) => Promise<NextResponse<ApiResponse<T>>> {
  return async (req, params) => {
    const correlationId = getOrCreateCorrelationId(req);
    const logger = createRequestLogger({
      requestId: correlationId,
      method: req.method,
      url: req.url,
      userId: undefined, // Will be set in withAuthentication if applicable
    });

    try {
      const result = await handler(req, params, logger);
      return createApiResponse(result);
    } catch (error) {
      if (error instanceof ApiError) {
        logger.error('API Error', {
          error: error,
          statusCode: error.statusCode,
          code: error.code,
        });
        return createApiError(error.message, error.statusCode, error.code);
      }
      logger.error('Unexpected API Error', { error });
      return createApiError('Internal server error', 500);
    }
  };
}

// Higher-order function for authenticated routes
export function withAuthentication<T>(
  handler: AuthenticatedApiHandler<T>,
): (
  req: NextRequest,
  params?: { [key: string]: string | string[] },
) => Promise<NextResponse<ApiResponse<T>>> {
  return withErrorHandling(async (req, params, logger) => {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      logger?.warn('Authentication failed', {
        reason: 'No valid session found',
      });
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const userLogger = logger?.child({ userId: session.user.id });

    userLogger?.debug('Authentication successful', {
      userId: session.user.id,
    });

    return handler(session, req, params, userLogger);
  });
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new ApiError(
      400,
      `Missing required fields: ${missingFields.join(', ')}`,
      'MISSING_FIELDS',
    );
  }
}

export async function parseRequestBody<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new ApiError(400, 'Invalid JSON body', 'INVALID_JSON');
  }
}

export function getQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    limit: Math.min(Number.parseInt(searchParams.get('limit') || '20'), 100),
    offset: Math.max(Number.parseInt(searchParams.get('offset') || '0'), 0),
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
  };
}
