'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, MapPin, SlidersHorizontal, ChevronDown, ChevronUp, DollarSign, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, Variants, AnimatePresence } from 'framer-motion';

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    const type = formData.get('type') as string;
    const location = formData.get('location') as string;
    const minPrice = formData.get('minPrice') as string;
    const maxPrice = formData.get('maxPrice') as string;
    const beds = formData.get('beds') as string;
    const baths = formData.get('baths') as string;

    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (type) params.append('type', type);
    if (location) params.append('location', location);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (beds) params.append('beds', beds);
    if (baths) params.append('baths', baths);
    params.append('status', activeTab === 'buy' ? 'For Sale' : 'For Rent');
    
    router.push(`/properties?${params.toString()}`);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
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
            className="bg-white/85 backdrop-blur-xl p-6 mt-6 sm:mt-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 text-gray-800"
          >
            {/* Sleek Tab Container */}
            <div className="flex mb-5 relative bg-gray-100/80 p-1 rounded-full w-fit gap-1 border border-gray-200/50 backdrop-blur-sm z-0">
              <button
                type="button"
                onClick={() => setActiveTab('buy')}
                className={`relative px-6 py-2 font-bold rounded-full text-sm sm:text-base transition-colors duration-300 focus:outline-none z-10 ${
                  activeTab === 'buy' ? 'text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Buy
                {activeTab === 'buy' && (
                  <motion.span
                    layoutId="activeTabBubble"
                    className="absolute inset-0 bg-[#3fa8e4] rounded-full z-[-1] shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rent')}
                className={`relative px-6 py-2 font-bold rounded-full text-sm sm:text-base transition-colors duration-300 focus:outline-none z-10 ${
                  activeTab === 'rent' ? 'text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Rent
                {activeTab === 'rent' && (
                  <motion.span
                    layoutId="activeTabBubble"
                    className="absolute inset-0 bg-[#3fa8e4] rounded-full z-[-1] shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              {/* Main Inputs Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Text search input */}
                <div className="relative md:col-span-5">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="query"
                    type="text"
                    placeholder="Search keyword, title, neighborhood..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]/50 focus:border-[#3fa8e4] bg-white/75 backdrop-blur-sm transition-all text-sm font-medium placeholder-gray-400"
                  />
                </div>

                {/* Property Type selection */}
                <div className="relative md:col-span-3">
                  <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <select
                    name="type"
                    className="w-full pl-11 pr-8 py-3.5 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]/50 focus:border-[#3fa8e4] bg-white/75 backdrop-blur-sm transition-all appearance-none text-sm font-medium"
                  >
                    <option value="">All Types</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Land">Land</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Location Selection */}
                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <select
                    name="location"
                    className="w-full pl-11 pr-8 py-3.5 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]/50 focus:border-[#3fa8e4] bg-white/75 backdrop-blur-sm transition-all appearance-none text-sm font-medium"
                  >
                    <option value="">All Locations</option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Lalitpur">Lalitpur</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Submit button */}
                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    className="bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 w-full flex items-center justify-center py-3.5 px-4 h-full text-sm font-bold shadow-md hover:shadow-lg rounded-xl transition-all"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Advanced Filter Trigger & Advanced Drawer */}
              <div className="pt-2 border-t border-gray-100 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-xs font-semibold text-gray-500 hover:text-[#3fa8e4] transition-colors w-fit gap-1.5 focus:outline-none py-1"
                >
                  <SlidersHorizontal size={14} />
                  <span>Advanced Search Filters</span>
                  {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-3">
                        {/* Min Price */}
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          <input
                            name="minPrice"
                            type="number"
                            placeholder="Min Price (NPR)"
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]/50 focus:border-[#3fa8e4] bg-white/75 backdrop-blur-sm transition-all text-xs font-medium"
                          />
                        </div>

                        {/* Max Price */}
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          <input
                            name="maxPrice"
                            type="number"
                            placeholder="Max Price (NPR)"
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]/50 focus:border-[#3fa8e4] bg-white/75 backdrop-blur-sm transition-all text-xs font-medium"
                          />
                        </div>

                        {/* Beds select */}
                        <div className="relative">
                          <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          <select
                            name="beds"
                            className="w-full pl-9 pr-8 py-2.5 rounded-lg text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]/50 focus:border-[#3fa8e4] bg-white/75 backdrop-blur-sm transition-all appearance-none text-xs font-medium"
                          >
                            <option value="">Beds (Any)</option>
                            <option value="1">1+ Beds</option>
                            <option value="2">2+ Beds</option>
                            <option value="3">3+ Beds</option>
                            <option value="4">4+ Beds</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Baths select */}
                        <div className="relative">
                          <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          <select
                            name="baths"
                            className="w-full pl-9 pr-8 py-2.5 rounded-lg text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]/50 focus:border-[#3fa8e4] bg-white/75 backdrop-blur-sm transition-all appearance-none text-xs font-medium"
                          >
                            <option value="">Baths (Any)</option>
                            <option value="1">1+ Baths</option>
                            <option value="2">2+ Baths</option>
                            <option value="3">3+ Baths</option>
                            <option value="4">4+ Baths</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
