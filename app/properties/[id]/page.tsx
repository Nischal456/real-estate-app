import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Property } from '@/types';
import { formatNpr } from '@/lib/utils';
import { MapPin, BedDouble, Bath, Ruler, Landmark, CheckCircle } from 'lucide-react';
import { ImageGallery } from '@/components/property/ImageGallery';
import { EnquiryForm } from '@/components/property/EnquiryForm';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const RoadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 flex-shrink-0">
      <path d="M4 17l4-12" /><path d="M20 5l-4 12" /><path d="M16 5h4" /><path d="M4 17h4" />
    </svg>
);

async function getProperty(id: string): Promise<Property | null> {
  try {
    const propertyDocRef = doc(db, "properties", id);
    const propertyDocSnap = await getDoc(propertyDocRef);
    if (!propertyDocSnap.exists()) return null;
    const propertyData = propertyDocSnap.data();
    const ownerId = propertyData.ownerId;
    const ownerDetails: any = {
      ownerName: propertyData.ownerName || 'Anonymous',
      ownerPhotoUrl: propertyData.ownerPhotoUrl || null,
      ownerPhoneNumber: propertyData.ownerPhoneNumber || undefined,
      ownerEmail: undefined,
      ownerRole: 'User'
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
    return { ...propertyData, id: propertyDocSnap.id, ...ownerDetails } as Property;
  } catch {
    return null;
  }
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
    if (!value) return null;
    return (
        <div className="flex flex-col p-4 border rounded-lg bg-gray-50/50">
            <div className="flex items-center text-gray-500 mb-1">
                {icon}
                <span className="ml-2 text-sm font-medium">{label}</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{value}</p>
        </div>
    );
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
  const priceDisplay = property.status === 'For Rent' ? `${formatNpr(property.price)} / month` : `Rs. ${formatNpr(property.price)}`;
  return (
    <div className="bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 lg:px-6 py-12">
        <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{property.title}</h1>
            <div className="flex items-center text-gray-500 mt-2"><MapPin className="w-5 h-5 mr-2 text-[#3fa8e4]" /><span>{property.location}</span></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ImageGallery featuredImageUrl={property.featuredImageUrl || ''} imageUrls={property.imageUrls} />
            <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.propertyType === 'Land' ? (
                    <>
                      <DetailItem icon={<Landmark size={24} />} label="Area" value={property.landArea} />
                      <DetailItem icon={<RoadIcon />} label="Road Access" value={property.roadAccess} />
                      <DetailItem icon={<Ruler size={24} />} label="Road Width" value={property.roadWidth} />
                    </>
                  ) : (
                    <>
                      <DetailItem icon={<BedDouble size={24} />} label="Bedrooms" value={property.beds} />
                      <DetailItem icon={<Bath size={24} />} label="Bathrooms" value={property.baths} />
                      <DetailItem icon={<Ruler size={24} />} label="Area" value={`${property.sqft} sqft`} />
                    </>
                  )}
                </div>
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{property.description}</p>
            </div>
            {property.facilities && property.facilities.length > 0 && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Facilities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                    {property.facilities.map(facility => (<div key={facility} className="flex items-center text-gray-800"><CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" /><span>{facility}</span></div>))}
                    </div>
                </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="p-6 border rounded-lg shadow-sm bg-white">
                <p className="text-3xl font-bold text-[#3fa8e4]">{priceDisplay}</p>
                <p className="text-gray-600">{property.status === 'For Rent' ? '' : 'Total Price'}</p>
              </div>
              <EnquiryForm property={property} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}