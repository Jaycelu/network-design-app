import { db } from '@/lib/db';
import { AIBaseAdapter } from './AIBaseAdapter';
import { AIHubMixAdapter } from './AIHubMixAdapter';
// Import other adapters here as they are created
// import { GoogleAdapter } from './GoogleAdapter';
// import { OpenAIAdapter } from './OpenAIAdapter';

/**
 * Dynamically selects and instantiates an AI adapter based on the requested model.
 * It prioritizes user-specific API keys and falls back to system-wide keys.
 *
 * @param modelId The unique identifier of the model to use (e.g., "gemini-1.5-pro").
 * @param userId The ID of the user making the request.
 * @returns A promise that resolves to an instance of a class implementing AIBaseAdapter.
 * @throws {Error} If the model is not found, not configured, or the provider is not supported.
 */
export async function getAIAdapter(modelId: string, userId: string): Promise<AIBaseAdapter> {
  // 1. Find the model configuration in the database
  const providerConfig = await db.aiProvider.findUnique({
    where: { modelId },
  });

  if (!providerConfig) {
    throw new Error(`Model configuration for "${modelId}" not found.`);
  }

  // 2. Prioritize user-specific API key
  let apiKey = (await db.userAPIKey.findUnique({
    where: { userId_providerId: { userId, providerId: providerConfig.id } },
  }))?.apiKey;

  // 3. Fall back to system API key from environment variables
  if (!apiKey) {
    if (!providerConfig.apiKeyEnv) {
      throw new Error(`System-level API key is not configured for provider: ${providerConfig.provider}`);
    }
    apiKey = process.env[providerConfig.apiKeyEnv];
  }

  if (!apiKey) {
    throw new Error(`API key for ${providerConfig.name} could not be found. Please configure it in your settings or contact the administrator.`);
  }

  // 4. Get the base URL from environment variables, if configured
  const baseUrl = providerConfig.baseUrlEnv ? process.env[providerConfig.baseUrlEnv] : undefined;

  // 5. Instantiate and return the correct adapter
  switch (providerConfig.provider.toLowerCase()) {
    case 'aihubmix':
      return new AIHubMixAdapter(apiKey, baseUrl);
    // case 'google':
    //   return new GoogleAdapter(apiKey, baseUrl);
    // case 'openai':
    //   return new OpenAIAdapter(apiKey, baseUrl);
    default:
      throw new Error(`Unsupported AI provider: "${providerConfig.provider}".`);
  }
}
