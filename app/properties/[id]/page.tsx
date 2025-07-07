import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Property } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PropertyDetailClient } from './PropertyDetailClient'; // <-- Import the new component

async function getProperty(id: string): Promise<Property | null> {
  // --- Your existing, unchanged data fetching logic ---
  try {
    const propertyDocRef = doc(db, "properties", id);
    const propertyDocSnap = await getDoc(propertyDocRef);
    if (!propertyDocSnap.exists()) return null;
    const propertyData = propertyDocSnap.data();
    const ownerId = propertyData.ownerId;
    let ownerDetails = {
      ownerName: propertyData.ownerName || 'Anonymous',
      ownerPhotoUrl: propertyData.ownerPhotoUrl || null,
      ownerPhoneNumber: propertyData.ownerPhoneNumber || undefined,
      ownerEmail: undefined as string | undefined,
      ownerRole: 'User' as 'Owner' | 'Agent' | 'User'
    };
    if (ownerId) {
      const userDocRef = doc(db, "users", ownerId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        ownerDetails.ownerName = userData.displayName || ownerDetails.ownerName;
        ownerDetails.ownerPhotoUrl = userData.photoURL || ownerDetails.ownerPhotoUrl;
        ownerDetails.ownerPhoneNumber = userData.phoneNumber || ownerDetails.ownerPhoneNumber;
        ownerDetails.ownerEmail = userData.email || undefined;
        ownerDetails.ownerRole = userData.role || 'User';
      }
    }
    const finalProperty: Property = {
      id: propertyDocSnap.id,
      title: propertyData.title || '',
      description: propertyData.description || '',
      propertyType: propertyData.propertyType || 'House',
      status: propertyData.status || 'For Sale',
      price: propertyData.price || '0',
      location: propertyData.location || '',
      featuredImageUrl: propertyData.featuredImageUrl || null,
      imageUrls: propertyData.imageUrls || [],
      createdAt: propertyData.createdAt || new Date().toISOString(),
      ownerId: ownerId,
      ownerName: ownerDetails.ownerName,
      ownerPhotoUrl: ownerDetails.ownerPhotoUrl,
      ownerPhoneNumber: ownerDetails.ownerPhoneNumber,
      ownerEmail: ownerDetails.ownerEmail,
      ownerRole: ownerDetails.ownerRole,
      beds: propertyData.beds,
      baths: propertyData.baths,
      sqft: propertyData.sqft,
      facilities: propertyData.facilities,
      landArea: propertyData.landArea,
      landFace: propertyData.landFace,
      roadAccess: propertyData.roadAccess,
      roadWidth: propertyData.roadWidth,
    };
    return finalProperty;
  } catch (error) {
    console.error("Failed to fetch property and owner details:", error);
    return null;
  }
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <>
        <Header />
        <main className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h1 className="text-3xl font-bold text-gray-700">Property Not Found</h1>
          <p className="text-gray-500 mt-2">The listing you are looking for does not exist or has been removed.</p>
        </main>
        <Footer />
      </>
    );
  }

  return <PropertyDetailClient property={property} />;
}