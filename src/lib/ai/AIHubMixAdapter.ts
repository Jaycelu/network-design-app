import { AIBaseAdapter, ChatCompletionOptions, ChatMessage } from './AIBaseAdapter';
import axios from 'axios';

/**
 * Adapter for the AIHUBMIX service.
 * This implementation makes actual API calls to AIHUBMIX.
 */
export class AIHubMixAdapter implements AIBaseAdapter {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    if (!apiKey) {
      throw new Error('AIHUBMIX API key is required.');
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || 'https://aihubmix.com/v1'; // Default AIHUBMIX API endpoint
  }

  async createChatCompletion(options: ChatCompletionOptions): Promise<ReadableStream | object> {
    console.log(`Using AIHubMixAdapter for model: ${options.model}`);

    const requestPayload = {
      model: options.model,
      messages: options.messages,
      stream: options.stream,
      temperature: options.temperature,
      // Add other parameters as needed
    };

    try {
      // Make the actual API call to AIHUBMIX
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        requestPayload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'APP-Code': 'WTPN3476', // Replace with your 6-digit referral code
            'Content-Type': 'application/json',
          },
          responseType: options.stream ? 'stream' : 'json',
        }
      );

      if (options.stream) {
        // Return the stream directly
        return response.data;
      } else {
        // Return the JSON response
        return response.data;
      }
    } catch (error: any) {
      console.error('AIHUBMIX API Error:', error.response?.data || error.message);
      throw new Error(`AIHUBMIX API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
