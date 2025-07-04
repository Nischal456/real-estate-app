import { PropertyCard } from './PropertyCard';
import { Property } from '@/types';
import Link from 'next/link';

async function getProperties(): Promise<Property[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/properties`, { 
      cache: 'no-store' 
    });
    if (!res.ok) {
      console.error("Failed to fetch properties:", await res.text());
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("An error occurred while fetching properties:", error);
    return [];
  }
}

export async function FeaturedProperties() {
  const properties = await getProperties();

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Exclusive Properties</h2>
        </div>
        
        {properties.length === 0 ? (
          <p className="text-center text-gray-500">No properties found. Add one to see it here!</p>
        ) : (
          // Updated grid to show 4 cards on medium screens
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {properties.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
        <div className="text-center mt-12">
            <Link href="/properties" className="text-[#3fa8e4] font-semibold hover:underline">
                See All Exclusive Properties &gt;
            </Link>
        </div>
      </div>
    </section>
  );
}
