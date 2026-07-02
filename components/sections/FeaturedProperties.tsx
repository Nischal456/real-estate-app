import { Property } from '@/types';
import { FeaturedPropertiesClient } from './FeaturedPropertiesClient'; // Import the new client component
import { getPropertiesFromDb } from '@/lib/properties';

async function getProperties(): Promise<Property[]> {
  try {
    return await getPropertiesFromDb();
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