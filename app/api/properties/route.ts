import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import { Property } from '@/types';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const formData = await request.formData();
    const imageFiles = formData.getAll('images') as File[];
    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json({ message: 'At least one image file is required.' }, { status: 400 });
    }

    const uploadPromises = imageFiles.map(async (file) => {
      const imageBuffer = await file.arrayBuffer();
      const optimizedBuffer = await sharp(Buffer.from(imageBuffer)).resize({ width: 1200 }).webp({ quality: 80 }).toBuffer();
      const dataUri = `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
      const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: 'dream_homes' });
      return uploadResult.secure_url;
    });
    const imageUrls = await Promise.all(uploadPromises);

    const propertyData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        propertyType: formData.get('propertyType') as string,
        status: formData.get('status') as string,
        price: formData.get('price') as string,
        location: formData.get('location') as string,
        beds: formData.get('beds') as string || undefined,
        baths: formData.get('baths') as string || undefined,
        sqft: formData.get('sqft') as string || undefined,
        landArea: formData.get('landArea') as string || undefined,
        landFace: formData.get('landFace') as string || undefined,
        roadAccess: formData.get('roadAccess') as string || undefined,
        roadWidth: formData.get('roadWidth') as string || undefined,
        facilities: formData.getAll('facilities') as string[],
        imageUrls: imageUrls,
        featuredImageUrl: imageUrls[0],
        createdAt: new Date().toISOString(),
        ownerId: uid,
        ownerName: formData.get('ownerName') as string,
        ownerPhotoUrl: formData.get('ownerPhotoUrl') as string,
        ownerPhoneNumber: formData.get('ownerPhoneNumber') as string
    };
    
    Object.keys(propertyData).forEach(key => {
        if (propertyData[key as keyof typeof propertyData] === undefined) {
            delete propertyData[key as keyof typeof propertyData];
        }
    });

    const docRef = await adminDb.collection("properties").add(propertyData);
    return NextResponse.json({ message: "Property added successfully", id: docRef.id }, { status: 201 });

  } catch (error: any) {
    console.error("Error adding property: ", error);
    return NextResponse.json({ message: "Failed to add property" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase().trim();
    const type = searchParams.get('type');
    const location = searchParams.get('location')?.toLowerCase().trim();
    const status = searchParams.get('status');

    const querySnapshot = await getDocs(collection(db, "properties"));
    
    const allProperties: Property[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Property);

    // --- ROBUST FILTERING LOGIC ---
    const filteredProperties = allProperties.filter(p => {
      const statusMatch = !status || p.status === status;
      const typeMatch = !type || p.propertyType === type;
      const locationMatch = !location || (p.location && p.location.toLowerCase().includes(location));
      const queryMatch = !query || 
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query));

      return statusMatch && typeMatch && locationMatch && queryMatch;
    });

    const sortedProperties = filteredProperties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json(sortedProperties, { status: 200 });

  } catch (error) {
    console.error("Error fetching properties: ", error);
    return NextResponse.json({ message: "Failed to fetch properties" }, { status: 500 });
  }
}