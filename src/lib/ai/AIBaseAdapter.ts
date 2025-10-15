export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionOptions {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Defines the common interface that all AI provider adapters must implement.
 */
export interface AIBaseAdapter {
  /**
   * Creates a chat completion based on the provided options.
   * @param options The options for creating the chat completion.
   * @returns A promise that resolves to a ReadableStream for streaming responses,
   *          or a plain object for non-streaming responses.
   */
  createChatCompletion(options: ChatCompletionOptions): Promise<ReadableStream | object>;
}
