import { NextRequest } from 'next/server';
import { getAIAdapter } from '@/lib/ai/AIFactory';
import { ChatMessage } from '@/lib/ai/AIBaseAdapter';

export const runtime = 'edge'; // Recommended for streaming responses

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, modelId }: { messages: ChatMessage[], modelId: string } = body;

    if (!messages || messages.length === 0 || !modelId) {
      return Response.json(
        { success: false, error: '`messages` array and `modelId` are required.' },
        { status: 400 }
      );
    }

    // TODO: Replace this with a real authentication service to get the user ID.
    // For now, we are using a placeholder user ID to make the factory work.
    const userId = 'cl-placeholder-user-id';

    // 1. Get the appropriate AI adapter using the factory
    const adapter = await getAIAdapter(modelId, userId);

    // 2. Call the adapter to get a stream or a response
    const response = await adapter.createChatCompletion({
      model: modelId,
      messages: messages,
      stream: true, // Always prefer streaming for chat
    });

    // 3. Return the streaming response
    // The adapter is responsible for returning a ReadableStream.
    return new Response(response as ReadableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
      },
    });

  } catch (error: any) {
    console.error('AI Chat API Error:', error);
    // Return a JSON error response with a proper status code
    const errorMessage = error.message || 'An internal server error occurred.';
    const statusCode = error.message.includes('not found') ? 404 : 500;
    
    return Response.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}
