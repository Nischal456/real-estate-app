import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Property } from '@/types';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { PropertiesClientView } from './PropertiesClientView'; // Import the new client component
import { getPropertiesFromDb } from '@/lib/properties';

async function getFilteredProperties(searchParams: { [key: string]: string | string[] | undefined }): Promise<Property[]> {
  try {
    const filters = {
      query: typeof searchParams.query === 'string' ? searchParams.query : undefined,
      type: typeof searchParams.type === 'string' ? searchParams.type : undefined,
      location: typeof searchParams.location === 'string' ? searchParams.location : undefined,
      status: typeof searchParams.status === 'string' ? searchParams.status : undefined,
      minPrice: typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined,
      maxPrice: typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined,
      beds: typeof searchParams.beds === 'string' ? searchParams.beds : undefined,
      baths: typeof searchParams.baths === 'string' ? searchParams.baths : undefined,
    };
    return await getPropertiesFromDb(filters);
  } catch (error) {
    console.error("An error occurred while fetching properties:", error);
    return [];
  }
}

function PropertiesPageSkeleton() {
    return <div className="text-center py-20"><Loader2 className="h-12 w-12 animate-spin text-[#3fa8e4] mx-auto" /></div>;
}

export default async function PropertiesPage(props: { searchParams: Promise<{ [key:string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
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
