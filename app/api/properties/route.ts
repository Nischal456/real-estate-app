import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // For public GET requests
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import { Property } from '@/types';
import { adminDb, adminAuth } from '@/lib/firebase-admin'; // For secure POST requests

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // 1. Verify the user's token using the Admin SDK
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // 2. Process the form data
    const formData = await request.formData();
    const imageFiles = formData.getAll('images') as File[];

    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json({ message: 'At least one image file is required.' }, { status: 400 });
    }

    // 3. Upload images to Cloudinary
    const uploadPromises = imageFiles.map(async (file) => {
      const imageBuffer = await file.arrayBuffer();
      const optimizedBuffer = await sharp(Buffer.from(imageBuffer))
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      const base64Image = optimizedBuffer.toString('base64');
      const dataUri = `data:image/webp;base64,${base64Image}`;
      const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: 'dream_homes' });
      return uploadResult.secure_url;
    });
    const imageUrls = await Promise.all(uploadPromises);

    // 4. Construct the final data object, ensuring ownerId matches the verified user
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
        ownerId: uid, // Use the verified UID from the token
        ownerName: formData.get('ownerName') as string,
        ownerPhotoUrl: formData.get('ownerPhotoUrl') as string,
        ownerPhoneNumber: formData.get('ownerPhoneNumber') as string
    };
    
    // Remove undefined fields for cleaner data
    Object.keys(propertyData).forEach(key => {
        if (propertyData[key as keyof typeof propertyData] === undefined) {
            delete propertyData[key as keyof typeof propertyData];
        }
    });

    // 5. Save to Firestore using the Admin SDK
    const docRef = await adminDb.collection("properties").add(propertyData);

    return NextResponse.json({ message: "Property added successfully", id: docRef.id }, { status: 201 });

  } catch (error: any) {
    console.error("Error adding property: ", error);
    if (error.code === 'auth/id-token-expired') {
        return NextResponse.json({ message: 'Login session expired, please log in again.' }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed to add property" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase();
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const status = searchParams.get('status');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const querySnapshot = await getDocs(collection(db, "properties"));

    let allProperties: Property[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          propertyType: data.propertyType || 'House',
          status: data.status || 'For Sale',
          price: data.price || '0',
          location: data.location || '',
          featuredImageUrl: data.featuredImageUrl || null,
          imageUrls: data.imageUrls || [],
          createdAt: data.createdAt || new Date().toISOString(),
          ownerId: data.ownerId || '',
          ownerName: data.ownerName || 'Anonymous',
          ownerPhotoUrl: data.ownerPhotoUrl || null,
          ownerPhoneNumber: data.ownerPhoneNumber,
          beds: data.beds,
          baths: data.baths,
          sqft: data.sqft,
          facilities: data.facilities,
          landArea: data.landArea,
          landFace: data.landFace,
          roadAccess: data.roadAccess,
          roadWidth: data.roadWidth,
      };
    });

    // --- ADVANCED FILTERING LOGIC ---
    let filteredProperties = allProperties;

    if (status) {
      filteredProperties = filteredProperties.filter(p => p.status === status);
    }
    if (type) {
      filteredProperties = filteredProperties.filter(p => p.propertyType === type);
    }
    if (location) {
      filteredProperties = filteredProperties.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (minPrice) {
      filteredProperties = filteredProperties.filter(p => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(p => Number(p.price) <= Number(maxPrice));
    }
    if (query) {
      filteredProperties = filteredProperties.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    // --- FILTERING LOGIC END ---

    filteredProperties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(filteredProperties, { status: 200 });

  } catch (error) {
    console.error("Error fetching properties: ", error);
    return NextResponse.json({ message: "Failed to fetch properties" }, { status: 500 });
  }
}
