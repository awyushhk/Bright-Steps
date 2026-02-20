// app/api/screenings/[screeningId]/route.js

import { auth } from '@clerk/nextjs/server';
import { getScreeningById, updateScreening } from '@/lib/queries';

export async function GET(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { screeningId } = await params; // await params

  const screening = await getScreeningById(screeningId);
  if (!screening) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json(screening);
}

export async function PATCH(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { screeningId } = await params; // await params

  const body = await request.json();
  await updateScreening(screeningId, body);
  return Response.json({ success: true });
}