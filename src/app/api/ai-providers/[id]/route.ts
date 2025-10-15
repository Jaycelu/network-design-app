import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: { id: string };
}

/**
 * PUT /api/ai-providers/[id]
 * Updates an existing AI provider configuration.
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = params;
  try {
    const body = await req.json();
    const { name, modelId, provider } = body;

    if (!name || !modelId || !provider) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedProvider = await db.aiProvider.update({
      where: { id },
      data: {
        name,
        modelId,
        provider,
      },
    });

    return NextResponse.json(updatedProvider);
  } catch (error) {
    console.error(`Failed to update AI provider ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/ai-providers/[id]
 * Deletes an AI provider configuration.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = params;
  try {
    // We must delete the associated UserAPIKey records first due to the relation
    await db.userAPIKey.deleteMany({
      where: { providerId: id },
    });
    
    await db.aiProvider.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Failed to delete AI provider ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
