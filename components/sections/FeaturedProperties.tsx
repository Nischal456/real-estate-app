import { Property } from '@/types';
import { FeaturedPropertiesClient } from './FeaturedPropertiesClient'; // Import the new client component

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

// This is the main Server Component
export async function FeaturedProperties() {
  const properties = await getProperties();

  // It fetches the data and passes it to the client component for rendering
  return <FeaturedPropertiesClient properties={properties} />;
}