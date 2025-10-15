import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// TODO: Replace with actual user session logic
function getUserIdFromRequest(req: NextRequest) {
  // For now, returning a placeholder. In a real app, you'd get this from the session.
  return 'cl-placeholder-user-id';
}

/**
 * GET /api/ai-providers
 * Fetches all AI provider configurations.
 * In a multi-tenant app, this should be filtered by userId.
 */
export async function GET(req: NextRequest) {
  try {
    // In a real application, you would likely filter by userId or organizationId
    const providers = await db.aiProvider.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(providers);
  } catch (error) {
    console.error('Failed to fetch AI providers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/ai-providers
 * Creates a new AI provider configuration.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, modelId, provider, apiKey, baseUrl } = body;

    if (!name || !modelId || !provider || !apiKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // This is a simplified example. In a real app, you would associate this
    // provider with the user/organization and handle the API key securely.
    // For instance, the apiKey should be stored in a UserAPIKey record, not here.
    // This implementation assumes a simplified, single-user-like setup for now.

    const newProvider = await db.aiProvider.create({
      data: {
        name,
        modelId,
        provider,
        // Storing env var names, not keys. This part needs rethinking for user-input keys.
        // For now, let's just save the key directly for simplicity, BUT THIS IS NOT SECURE.
        apiKeyEnv: 'USER_PROVIDED_KEY', // Placeholder
        baseUrlEnv: baseUrl ? 'USER_PROVIDED_BASE_URL' : undefined,
      },
    });
    
    // TODO: The API key itself should be stored encrypted in the `UserAPIKey` table,
    // associated with the user and the `newProvider.id`.
    const userId = getUserIdFromRequest(req);
    await db.userAPIKey.create({
      data: {
        userId: userId,
        providerId: newProvider.id,
        apiKey: apiKey, // IMPORTANT: Encrypt this before saving!
      }
    });


    return NextResponse.json(newProvider, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create AI provider:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('modelId')) {
      return NextResponse.json({ error: 'Model ID already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
