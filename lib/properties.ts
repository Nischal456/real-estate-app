import { adminDb } from './firebase-admin';
import { Property } from '@/types';

export interface PropertyFilters {
  query?: string;
  type?: string;
  location?: string;
  status?: string;
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  baths?: string;
}

export async function getPropertiesFromDb(filters?: PropertyFilters): Promise<Property[]> {
  const query = filters?.query?.toLowerCase().trim();
  const type = filters?.type;
  const location = filters?.location?.toLowerCase().trim();
  const status = filters?.status;
  const minPrice = filters?.minPrice;
  const maxPrice = filters?.maxPrice;
  const beds = filters?.beds;
  const baths = filters?.baths;

  const querySnapshot = await adminDb.collection("properties").get();
  const allProperties: Property[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Property);
  
  const filteredProperties = allProperties.filter(p => {
    const statusMatch = !status || p.status === status;
    const typeMatch = !type || p.propertyType === type;
    const locationMatch = !location || (p.location && p.location.toLowerCase().includes(location));
    const queryMatch = !query || (p.title && p.title.toLowerCase().includes(query)) || (p.description && p.description.toLowerCase().includes(query));
    
    const priceVal = parseFloat(p.price);
    const minPriceMatch = !minPrice || isNaN(priceVal) || priceVal >= parseFloat(minPrice);
    const maxPriceMatch = !maxPrice || isNaN(priceVal) || priceVal <= parseFloat(maxPrice);
    
    const bedsMatch = !beds || parseInt(p.beds || '0') >= parseInt(beds);
    const bathsMatch = !baths || parseInt(p.baths || '0') >= parseInt(baths);

    return statusMatch && typeMatch && locationMatch && queryMatch && minPriceMatch && maxPriceMatch && bedsMatch && bathsMatch;
  });
  
  return filteredProperties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
