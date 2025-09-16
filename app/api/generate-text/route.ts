import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import {
  withAuthentication,
  parseRequestBody,
  validateRequiredFields,
} from '@/lib/api/base';

export const POST = withAuthentication(async (session, req, params, logger) => {
  logger?.info('Generate text request received');
  const body = await parseRequestBody<{
    prompt: string;
  }>(req);

  validateRequiredFields(body, ['prompt']);

  const { text } = await generateText({
    model: openai('gpt-3.5-turbo'),
    prompt: body.prompt,
  });

  logger?.info('Text generated successfully');
  return { text };
});