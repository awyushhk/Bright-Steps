import { auth } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function DELETE(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { childId } = await params;

  // Make sure the child belongs to this parent
  const rows = await sql`SELECT * FROM children WHERE id = ${childId} AND parent_id = ${userId}`;
  if (rows.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  // Delete related screenings first, then the child
  await sql`DELETE FROM screenings WHERE child_id = ${childId}`;
  await sql`DELETE FROM children WHERE id = ${childId}`;

  return Response.json({ success: true });
}