'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home } from 'lucide-react';
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
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const InputField = ({ icon: Icon, name, placeholder, options }: any) => (
    <div className="relative flex-1">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      {options ? (
        <select
          name={name}
          className="w-full p-3 pl-10 rounded-md text-gray-600 bg-gray-50/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#3fa8e4] focus:bg-white transition-all"
        >
          {options.map((opt: { value: string; label: string }) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type="text"
          placeholder={placeholder}
          className="w-full p-3 pl-10 rounded-md text-gray-800 bg-gray-50/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#3fa8e4] focus:bg-white transition-all"
        />
      )}
    </div>
  );

  const TABS = [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
  ];

  return (
    <section className="relative min-h-[85vh] md:min-h-[75vh] flex items-center justify-start overflow-hidden pt-20">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/10 backdrop-blur-sm"></div>

      <div className="container mx-auto px-4 lg:px-6 z-10">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900">
            🏡 Buy, sell, rent — easy with us,
          </motion.h1>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-[#3fa8e4] mt-2 mb-6">
            E-Bazarsecurities मा छ पूर्ण trust.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-base mb-8 text-gray-700 max-w-lg">
            Discover a wide range of properties for sale or rent in your desired location, filter by price, and more to find your dream property.
          </motion.p>

          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md p-2 md:p-4 rounded-lg shadow-2xl">
            <div className="relative flex border-b mb-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'buy' | 'rent')}
                  className={`px-6 py-3 font-semibold text-lg capitalize transition-colors relative z-10 ${
                    activeTab === tab.id ? 'text-[#3fa8e4]' : 'text-gray-600 hover:text-[#3fa8e4]'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                     <motion.div
                        className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#3fa8e4] rounded-t-full"
                        layoutId="active-tab-indicator"
                     />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="space-y-4 p-2">
              <InputField icon={Search} name="query" placeholder="Search by keyword, title, description..." />
              <div className="flex flex-col md:flex-row gap-3 items-center">
                 <InputField 
                  icon={Home}
                  name="type" 
                  options={[
                    { value: "", label: "All Types" },
                    { value: "House", label: "House" },
                    { value: "Apartment", label: "Apartment" },
                    { value: "Land", label: "Land" },
                  ]} 
                />
                <InputField 
                  icon={MapPin}
                  name="location" 
                  options={[
                    { value: "", label: "All Locations" },
                    { value: "Kathmandu", label: "Kathmandu" },
                    { value: "Pokhara", label: "Pokhara" },
                    { value: "Lalitpur", label: "Lalitpur" },
                  ]} 
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
                  <Button type="submit" className="bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 w-full flex items-center justify-center p-3 h-[50px] shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Search className="mr-2 h-5 w-5" /> Search
                  </Button>
                </motion.div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}