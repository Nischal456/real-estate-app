"use client";

import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Property } from '@/types';
import { formatNpr } from '@/lib/utils';
import { MapPin, BedDouble, Bath, Ruler, Landmark, CheckCircle } from 'lucide-react';
import { ImageGallery } from '@/components/property/ImageGallery';
import { EnquiryForm } from '@/components/property/EnquiryForm';
import { motion } from 'framer-motion';

const RoadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 flex-shrink-0">
      <path d="M4 17l4-12" /><path d="M20 5l-4 12" /><path d="M16 5h4" /><path d="M4 17h4" />
    </svg>
);

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
    if (!value) return null;
    return (
        <motion.div 
            className="flex flex-col p-4 border rounded-lg bg-gray-50/50"
            whileHover={{ scale: 1.05, backgroundColor: '#ffffff' }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="flex items-center text-gray-500 mb-1">
                {icon}
                <span className="ml-2 text-sm font-medium">{label}</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{value}</p>
        </motion.div>
    );
}

// Animation variants for sections that appear on scroll
const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        // --- THIS IS THE FIX ---
        transition: { duration: 0.6, ease: "easeOut" } 
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export function PropertyDetailClient({ property }: { property: Property }) {
  const priceDisplay = property.status === 'For Rent' 
    ? `${formatNpr(property.price)} / month` 
    : `Rs. ${formatNpr(property.price)}`;

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 lg:px-6 py-12">
        <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{property.title}</h1>
            <div className="flex items-center text-gray-500 mt-2">
              <MapPin className="w-5 h-5 mr-2 text-[#3fa8e4]" />
              <span>{property.location}</span>
            </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
                className="lg:col-span-2 space-y-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
                <ImageGallery 
                    featuredImageUrl={property.featuredImageUrl || ''} 
                    imageUrls={property.imageUrls} 
                />
                
                <motion.div 
                    className="bg-white p-6 rounded-lg shadow-md"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Overview</h2>
                    <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={staggerContainer}>
                      {property.propertyType === 'Land' ? (
                        <>
                          <motion.div variants={staggerItem}><DetailItem icon={<Landmark size={24} />} label="Area" value={property.landArea} /></motion.div>
                          <motion.div variants={staggerItem}><DetailItem icon={<RoadIcon />} label="Road Access" value={property.roadAccess} /></motion.div>
                          <motion.div variants={staggerItem}><DetailItem icon={<Ruler size={24} />} label="Road Width" value={property.roadWidth} /></motion.div>
                        </>
                      ) : (
                        <>
                          <motion.div variants={staggerItem}><DetailItem icon={<BedDouble size={24} />} label="Bedrooms" value={property.beds} /></motion.div>
                          <motion.div variants={staggerItem}><DetailItem icon={<Bath size={24} />} label="Bathrooms" value={property.baths} /></motion.div>
                          <motion.div variants={staggerItem}><DetailItem icon={<Ruler size={24} />} label="Area" value={`${property.sqft} sqft`} /></motion.div>
                        </>
                      )}
                    </motion.div>
                </motion.div>
                
                <motion.div 
                    className="bg-white p-6 rounded-lg shadow-md"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Description</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{property.description}</p>
                </motion.div>
                
                {property.facilities && property.facilities.length > 0 && (
                    <motion.div 
                        className="bg-white p-6 rounded-lg shadow-md"
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Facilities</h2>
                        <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2" variants={staggerContainer}>
                        {property.facilities.map(facility => (
                            <motion.div key={facility} className="flex items-center text-gray-800" variants={staggerItem}>
                                <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                                <span>{facility}</span>
                            </motion.div>
                        ))}
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>

            <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            >
                <div className="sticky top-28 space-y-6">
                    <div className="p-6 border rounded-lg shadow-sm bg-white">
                        <p className="text-3xl font-bold text-[#3fa8e4]">{priceDisplay}</p>
                        <p className="text-gray-600">{property.status === 'For Rent' ? '' : 'Total Price'}</p>
                    </div>
                    <EnquiryForm property={property} />
                </div>
            </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}