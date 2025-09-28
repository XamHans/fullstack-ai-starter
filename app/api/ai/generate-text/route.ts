import {
  parseRequestBody,
  validateRequiredFields,
  withAITelemetry,
  withAuthentication,
} from '@/lib/api/base';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const POST = withAuthentication(async (session, req, params, logger) => {
  logger?.info('Generate text request received');

  const body = await parseRequestBody<{
    prompt: string;
  }>(req);

  validateRequiredFields(body, ['prompt']);

  const { text } = await generateText(
    withAITelemetry(
      {
        model: openai('gpt-3.5-turbo'),
        prompt: body.prompt,
      },
      {
        functionId: 'generate-text',
        metadata: {
          userId: session.userId,
          sessionId: session.id,
        },
      }
    )
  );

  logger?.info('Text generated successfully');
  return { text };
});
