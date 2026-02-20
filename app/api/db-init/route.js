import { createTables } from '@/lib/schema';

export async function GET() {
  try {
    await createTables();
    return Response.json({ success: true, message: 'Tables created successfully' });
  } catch (error) {
    console.error('DB init error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}