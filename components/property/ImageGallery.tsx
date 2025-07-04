'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  featuredImageUrl: string;
  imageUrls: string[];
}

export function ImageGallery({ featuredImageUrl, imageUrls }: ImageGalleryProps) {
  const [mainImage, setMainImage] = useState(featuredImageUrl);

  return (
    <div>
      {/* Main Image Display */}
      <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden shadow-lg mb-4">
        <Image
          src={mainImage}
          alt="Main property view"
          fill
          className="object-cover transition-all duration-300"
          priority
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
              mainImage === url ? 'border-[#3fa8e4]' : 'border-transparent'
            }`}
            onClick={() => setMainImage(url)}
          >
            <Image
              src={url}
              alt={`Property thumbnail ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
