import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { generateText, stepCountIs } from 'ai';
import {
  ApiError,
  parseRequestBody,
  validateRequiredFields,
  withAITelemetry,
  withAuthentication,
} from '@/lib/api/base';

type SearchProvider = 'openai' | 'google';

export const POST = withAuthentication(async (session, req, params, logger) => {
  logger?.info('Web search request received');

  const body = await parseRequestBody<{
    query: string;
    provider?: SearchProvider;
  }>(req);

  validateRequiredFields(body, ['query']);

  const provider: SearchProvider = body.provider ?? 'openai';
  const query = body.query.trim();

  if (!query) {
    throw new ApiError(400, 'Query cannot be empty', 'INVALID_QUERY');
  }

  const telemetryMetadata = {
    userId: session.userId,
    sessionId: session.id,
    provider,
  };

  const sharedConfig = {
    prompt: query,
    stopWhen: stepCountIs(2),
  };

  if (provider === 'google') {
    const result = await generateText(
      withAITelemetry(
        {
          ...sharedConfig,
          model: google('gemini-2.5-flash'),
          tools: {
            google_search: google.tools.googleSearch({}),
          },
        },
        {
          functionId: 'web-search',
          metadata: telemetryMetadata,
        },
      ),
    );

    logger?.info('Web search (Google) completed successfully', {
      sourceCount: result.sources?.length ?? 0,
    });

    return {
      provider,
      answer: result.text,
      sources: result.sources ?? [],
      providerMetadata: result.providerMetadata?.google?.groundingMetadata,
    };
  }

  const result = await generateText(
    withAITelemetry(
      {
        ...sharedConfig,
        model: openai.responses('gpt-4o-mini'),
        tools: {
          web_search_preview: openai.tools.webSearchPreview({}),
        },
      },
      {
        functionId: 'web-search',
        metadata: telemetryMetadata,
      },
    ),
  );

  logger?.info('Web search (OpenAI) completed successfully', {
    sourceCount: result.sources?.length ?? 0,
  });

  return {
    provider,
    answer: result.text,
    sources: result.sources ?? [],
    providerMetadata: result.providerMetadata,
  };
});
