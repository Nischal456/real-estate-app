import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { PropertyCard } from '@/components/sections/PropertyCard';
import { Property } from '@/types';
import { Search } from 'lucide-react';
import { Filters } from '@/components/property/Filters'; // Import the new component
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

async function getFilteredProperties(searchParams: { [key: string]: string | string[] | undefined }): Promise<Property[]> {
  try {
    const params = new URLSearchParams();
    for (const key in searchParams) {
      const value = searchParams[key];
      if (typeof value === 'string') {
        params.append(key, value);
      }
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/properties?${params.toString()}`, { 
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

function PropertiesList({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <Search className="mx-auto h-16 w-16 text-gray-300" />
        <p className="mt-4 text-xl text-gray-500">No properties found matching your criteria.</p>
        <p className="text-gray-400">Try adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {properties.map(prop => (
        <PropertyCard key={prop.id} property={prop} />
      ))}
    </div>
  );
}

function PropertiesListSkeleton() {
    return <div className="text-center py-20"><Loader2 className="h-12 w-12 animate-spin text-[#3fa8e4] mx-auto" /></div>;
}


export default async function PropertiesPage({ searchParams }: { searchParams: { [key:string]: string | string[] | undefined } }) {
  const properties = await getFilteredProperties(searchParams);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 lg:px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Find Your Next Property
          </h1>
          <p className="text-gray-600 mt-2">
            Browse all listings or use the filters to narrow your search.
          </p>
        </div>
        
        {/* Add the interactive Filters component */}
        <Filters />
        
        {/* Suspense boundary for a better loading experience */}
        <Suspense fallback={<PropertiesListSkeleton />}>
            <PropertiesList properties={properties} />
        </Suspense>

      </main>
      <Footer />
    </div>
  );
}
