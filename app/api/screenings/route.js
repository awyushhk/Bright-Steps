import { auth } from '@clerk/nextjs/server';
import {
  getScreeningsByParent,
  getScreeningsByChild,
  addScreening,
  getAllSubmittedScreenings,
} from '@/lib/queries';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get('childId');
  const all = searchParams.get('all');

  const user = await currentUser();
  const role = user?.publicMetadata?.role;

  if (all === 'true' && role === 'clinician') {
    const screenings = await getAllSubmittedScreenings();
    return Response.json(screenings);
  }

  if (childId) {
    const screenings = await getScreeningsByChild(childId);
    return Response.json(screenings);
  }

  const screenings = await getScreeningsByParent(userId);
  return Response.json(screenings);
}

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const screening = await addScreening(body);
  return Response.json(screening, { status: 201 });
}