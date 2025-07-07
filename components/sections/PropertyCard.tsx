import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types';
import { formatNpr } from '@/lib/utils';
import { MapPin, BedDouble, Bath, Ruler, Landmark, ImageOff } from 'lucide-react';

const RoadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 17l4-12" /><path d="M20 5l-4 12" /><path d="M16 5h4" /><path d="M4 17h4" />
  </svg>
);

export function PropertyCard({ property }: { property: Property }) {
  const priceDisplay = property.status === 'For Rent'
    ? `Rs ${formatNpr(property.price)} / month`
    : `Rs ${formatNpr(property.price)} Per Aana`;

  const statusTagColor = property.status === 'For Sale' ? 'bg-green-500' : 'bg-blue-500';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border group transition-all duration-300 hover:shadow-xl">
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Link href={`/properties/${property.id}`} className="block w-full h-full">
          {property.featuredImageUrl ? (
            <Image
              src={property.featuredImageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ImageOff className="w-10 h-10 text-gray-400" />
            </div>
          )}
        </Link>
        <div className={`absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full ${statusTagColor}`}>
          {property.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        {/* Price */}
        <div className="mb-2">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-sky-400 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
            {priceDisplay}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-800 leading-snug mb-1 group-hover:text-[#3fa8e4] transition-colors duration-200">
          <Link href={`/properties/${property.id}`}>{property.title}</Link>
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
          {property.location}
        </p>

        {/* Bottom Info */}
          <div className="border-t pt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700">
          {property.propertyType === 'Land' ? (
            <>
              <span className="flex items-center" title="Land Area">
                <Landmark className="w-4 h-4 mr-1.5 text-gray-500" />
                {property.landArea}
              </span>
              <span className="flex items-center" title="Road Access">
                <RoadIcon />
                <span className="ml-1.5">{property.roadWidth}</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center" title="Bedrooms">
                <BedDouble className="w-4 h-4 mr-1.5 text-gray-500" />
                {property.beds}
              </span>
              <span className="flex items-center" title="Bathrooms">
                <Bath className="w-4 h-4 mr-1.5 text-gray-500" />
                {property.baths}
              </span>
              <span className="flex items-center" title="Area">
                <Ruler className="w-4 h-4 mr-1.5 text-gray-500" />
                {property.sqft} sqft
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
