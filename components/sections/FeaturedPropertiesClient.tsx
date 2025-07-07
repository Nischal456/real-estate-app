"use client"; // This directive marks the component as a Client Component

import { PropertyCard } from './PropertyCard';
import { Property } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants for the container to orchestrate staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Animation variants for each property card
const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

// This component receives properties as a prop and handles all UI and animations
export function FeaturedPropertiesClient({ properties }: { properties: Property[] }) {
  return (
    <motion.section 
      className="py-16 md:py-24 bg-gray-50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "circOut" }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Exclusive Properties
          </h2>
        </motion.div>
        
        {properties.length === 0 ? (
          <motion.p 
            className="text-center text-gray-500 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            No properties found. Add one to see it here!
          </motion.p>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {properties.map(prop => (
              <motion.div
                key={prop.id}
                variants={itemVariants}
                whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 300 } }}
              >
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeIn" }}
        >
            <Link href="/properties" className="inline-block bg-[#3fa8e4] text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-[#3596cc] transition-all duration-300 transform hover:scale-105">
                See All Exclusive Properties &rarr;
            </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}