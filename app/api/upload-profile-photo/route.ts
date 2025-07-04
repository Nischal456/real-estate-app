import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ message: 'Image file is required.' }, { status: 400 });
    }

    const imageBuffer = await imageFile.arrayBuffer();
    const optimizedBuffer = await sharp(Buffer.from(imageBuffer))
      .resize({ width: 400, height: 400, fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();

    const base64Image = optimizedBuffer.toString('base64');
    const dataUri = `data:image/webp;base64,${base64Image}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'profile_photos',
      gravity: 'face',
      crop: 'thumb',
      width: 200,
      height: 200,
    });

    return NextResponse.json({ imageUrl: uploadResult.secure_url }, { status: 200 });

  } catch (error) {
    console.error("Error uploading profile photo: ", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
