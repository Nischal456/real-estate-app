import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Property } from '@/types';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { PropertiesClientView } from './PropertiesClientView'; // Import the new client component

async function getFilteredProperties(searchParams: { [key: string]: string | string[] | undefined }): Promise<Property[]> {
  try {
    const params = new URLSearchParams();
    const query = searchParams.query;
    const type = searchParams.type;
    const location = searchParams.location;
    const status = searchParams.status;

    if (query && typeof query === 'string') params.append('query', query);
    if (type && typeof type === 'string') params.append('type', type);
    if (location && typeof location === 'string') params.append('location', location);
    if (status && typeof status === 'string') params.append('status', status);
    
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

function PropertiesPageSkeleton() {
    return <div className="text-center py-20"><Loader2 className="h-12 w-12 animate-spin text-[#3fa8e4] mx-auto" /></div>;
}

export default async function PropertiesPage({ searchParams }: { searchParams: { [key:string]: string | string[] | undefined } }) {
  const properties = await getFilteredProperties(searchParams);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 lg:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Find Your Next Property
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Browse all listings or use the filters to narrow your search.
          </p>
        </div>
        
        <Suspense fallback={<PropertiesPageSkeleton />}>
            <PropertiesClientView properties={properties} />
        </Suspense>

      </main>
      <Footer />
    </div>
  );
}
