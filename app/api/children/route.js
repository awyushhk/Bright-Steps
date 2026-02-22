import { auth } from '@clerk/nextjs/server';
import { getChildrenByParent, addChild } from '@/lib/queries';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const children = await getChildrenByParent(userId);
  return Response.json(children, {
    headers: {
      'Cache-Control': 'private, max-age=10, stale-while-revalidate=30',
    },
  });
}

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, dateOfBirth, gender } = body;

  if (!name || !dateOfBirth || !gender) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const child = await addChild({ parentId: userId, name, dateOfBirth, gender });
  return Response.json(child, { status: 201 });
}