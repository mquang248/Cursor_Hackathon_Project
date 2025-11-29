import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

/**
 * POST /api/upload
 * Upload image to Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    // Check Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.error('Missing Cloudinary configuration');
      return NextResponse.json(
        { success: false, error: 'Cloudinary chưa được cấu hình / Cloudinary not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { image, folder } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Không có ảnh / No image provided' },
        { status: 400 }
      );
    }

    console.log('Uploading image to Cloudinary...');
    console.log('Image size:', Math.round(image.length / 1024), 'KB');

    // Upload to Cloudinary
    const result = await uploadImage(image, folder || 'chronofeed/posts');

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Upload thất bại - kiểm tra Cloudinary config / Upload failed - check Cloudinary config' },
        { status: 500 }
      );
    }

    console.log('Upload successful:', result.url);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
      },
      message: 'Upload thành công / Upload successful',
    });
  } catch (error) {
    console.error('Upload API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Lỗi: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * Configuration for larger file uploads
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

