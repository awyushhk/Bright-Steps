
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { auth } from '@clerk/nextjs/server';
import cloudinary from '@/lib/cloudinary';


export async function POST(request) {
  console.log('🎬 upload-video route hit');
  const { userId } = await auth();
  console.log('👤 userId:', userId);
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const category = formData.get('category');
    const childId = formData.get('childId');

    console.log('📁 file:', file?.name, file?.size, file?.type);
    console.log('📂 category:', category, 'childId:', childId);
    console.log('☁️ Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌ MISSING',
      api_key: process.env.CLOUDINARY_API_KEY ? '✅' : '❌ MISSING',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✅' : '❌ MISSING',
    });

    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('📦 Buffer size:', buffer.length);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: `autism-screening/${userId}/${childId}`,
          public_id: `${category}-${Date.now()}`,
          // Auto-delete after 30 days for privacy
          invalidate: true,
        },
        (error, result) => {
          
          if (error) {
            console.log('❌ Cloudinary error:', error);
            reject(error);}
          else {
            console.log('✅ Cloudinary success:', result.secure_url);
            resolve(result);}
        }
      ).end(buffer);
    });

    return Response.json({
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}