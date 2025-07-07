"use client";

import { PropertyCard } from '@/components/sections/PropertyCard';
import { Property } from '@/types';
import { Filters } from '@/components/property/Filters';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

// Animation for the main container to orchestrate children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Animation for individual elements like the title and filters
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

// Animation for the property card grid items
const gridItemVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 15,
    },
  },
};

export function PropertiesClientView({ properties }: { properties: Property[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Filters are now rendered outside the conditional check, so they are always visible */}
      <motion.div variants={itemVariants}>
        <Filters />
      </motion.div>

      {/* --- THIS IS THE CORRECTED LOGIC --- */}
      {properties.length > 0 ? (
        // If properties exist, show the animated grid
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {properties.map(prop => (
            <motion.div
              key={prop.id}
              variants={gridItemVariants}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
            >
              <PropertyCard property={prop} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // If no properties exist, show the "Not Found" message below the filters
        <motion.div
          className="text-center py-16 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <Search className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600">No Properties Found</h2>
          <p className="mt-2 text-gray-400">Please try adjusting your search filters to find what you're looking for.</p>
        </motion.div>
      )}
    </motion.div>
  );
}