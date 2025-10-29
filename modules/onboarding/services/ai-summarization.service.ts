// AI Summarization Service for Onboarding
// Uses OpenAI API to generate natural language summaries with markdown formatting

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export interface SummarizeRequest {
  text: string;
  type: 'diet' | 'persona';
}

export interface SummarizeResponse {
  summary: string; // Markdown-formatted natural language
}

/**
 * Summarizes user input (diet preferences or persona background) using OpenAI
 * Returns markdown-formatted natural language suitable for system prompts
 */
export async function summarizeWithAI(request: SummarizeRequest): Promise<SummarizeResponse> {
  const { text, type } = request;

  // Create appropriate prompts based on type
  const systemPrompt =
    type === 'diet'
      ? `You are a nutritional summarization assistant. Convert user dietary preferences into a concise, natural language summary with markdown formatting.

Start with "**Diet**:" and describe their dietary approach in a clear, professional manner.
Focus on the key restrictions and preferences mentioned.
Keep it to 1-2 sentences maximum.

Example input: "vegetarian, no gluten"
Example output: "**Diet**: Follows a vegetarian diet with gluten-free restrictions for optimal health"`
      : `You are a persona summarization assistant. Convert user background information into a concise, natural language summary with markdown formatting.

Start with "**Profile**:" and capture their lifestyle, goals, and priorities in a clear, professional manner.
Focus on meal-related aspects and time considerations.
Keep it to 1-2 sentences maximum.

Example input: "Busy professional seeking healthy meal prep"
Example output: "**Profile**: Busy professional prioritizing healthy meal preparation and time-efficient cooking"`;

  try {
    const { text: generatedText } = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: text,
      temperature: 0.7,
      maxTokens: 100,
    });

    return {
      summary: generatedText.trim(),
    };
  } catch (error) {
    // Re-throw with more context for better error handling upstream
    throw new Error(
      `AI summarization failed for ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
