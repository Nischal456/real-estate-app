'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    const type = formData.get('type') as string;
    const location = formData.get('location') as string;
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (type) params.append('type', type);
    if (location) params.append('location', location);
    params.append('status', activeTab === 'buy' ? 'For Sale' : 'For Rent');
    router.push(`/properties?${params.toString()}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="relative h-[90vh] md:h-[75vh] flex items-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
        style={{ objectFit: 'cover', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <source src="https://videos.pexels.com/video-files/32093277/13681830_1920_1080_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />

      <div className="relative container mx-auto px-4 md:px-6 z-10">
        <motion.div
          className="max-w-2xl text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-[2rem] sm:text-[2.5rem] md:text-[3.2rem] font-extrabold leading-snug sm:leading-tight tracking-tight text-shadow-lg"
          >
            🏡Buy, sell, rent —<br className="block sm:hidden" />
            <span className="hidden sm:inline"> easy with us,</span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-[2rem] sm:text-[2.5rem] md:text-[3.2rem] font-extrabold leading-snug sm:leading-tight tracking-tight text-[#3fa8e4] text-shadow-md"
          >
            E-Bazarsecurities मा छ पूर्ण trust.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-200 max-w-md text-shadow"
          >
            Discover a wide range of properties for sale or rent in your desired location, filter by price, and more to find your dream property.
          </motion.p>

          {/* Search Form */}
          <motion.div
            variants={itemVariants}
            className="bg-white/95 backdrop-blur-sm p-4 mt-6 sm:mt-8 rounded-lg shadow-2xl"
          >
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab('buy')}
                className={`px-4 py-2 font-semibold transition-colors text-sm sm:text-base ${
                  activeTab === 'buy'
                    ? 'border-b-2 border-[#3fa8e4] text-[#3fa8e4]'
                    : 'text-gray-500 hover:text-[#3fa8e4]'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={`px-4 py-2 font-semibold transition-colors text-sm sm:text-base ${
                  activeTab === 'rent'
                    ? 'border-b-2 border-[#3fa8e4] text-[#3fa8e4]'
                    : 'text-gray-500 hover:text-[#3fa8e4]'
                }`}
              >
                Rent
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="query"
                  type="text"
                  placeholder="Search by keyword, title, description..."
                  className="w-full pl-10 pr-4 py-3 rounded-md text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <select
                  name="type"
                  className="w-full p-3 rounded-md text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4] bg-white"
                >
                  <option value="">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Land">Land</option>
                </select>
                <select
                  name="location"
                  className="w-full p-3 rounded-md text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4] bg-white"
                >
                  <option value="">All Locations</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Lalitpur">Lalitpur</option>
                </select>
                <Button
                  type="submit"
                  className="bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 w-full sm:col-span-2 lg:col-span-1 flex items-center justify-center p-3 h-full text-base font-bold"
                >
                  Search
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
