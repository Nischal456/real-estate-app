'use client';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

  return (
    <section className="relative h-[65vh] flex items-center justify-start text-gray-800" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605276374104-5de67d60924f?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 lg:px-6 z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">🏡Buy, sell, rent — easy with us,</h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#3fa8e4]">E-Bazarsecurities मा छ पूर्ण trust.</h2>
          <p className="text-base mb-8 text-gray-700 max-w-lg">Discover a wide range of properties for sale or rent in your desired location, filter by price, and more to find your dream property.</p>
          <div className="bg-white p-4 rounded-lg shadow-2xl">
            <div className="flex border-b mb-4">
              <button onClick={() => setActiveTab('buy')} className={`px-6 py-2 font-semibold transition-colors ${activeTab === 'buy' ? 'border-b-2 border-[#3fa8e4] text-[#3fa8e4]' : 'text-gray-500 hover:text-[#3fa8e4]'}`}>Buy</button>
              <button onClick={() => setActiveTab('rent')} className={`px-6 py-2 font-semibold transition-colors ${activeTab === 'rent' ? 'border-b-2 border-[#3fa8e4] text-[#3fa8e4]' : 'text-gray-500 hover:text-[#3fa8e4]'}`}>Rent</button>
            </div>
            <form onSubmit={handleSearch} className="space-y-4">
              <input name="query" type="text" placeholder="Search by keyword, title, description..." className="w-full p-3 rounded-md text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <select name="type" className="w-full p-3 rounded-md text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]">
                  <option value="">All Types</option><option value="House">House</option><option value="Apartment">Apartment</option><option value="Land">Land</option>
                </select>
                <select name="location" className="w-full p-3 rounded-md text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]">
                  <option value="">All Locations</option><option value="Kathmandu">Kathmandu</option><option value="Pokhara">Pokhara</option><option value="Lalitpur">Lalitpur</option>
                </select>
                <select name="price" className="w-full p-3 rounded-md text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]">
                  <option value="">All Prices</option>
                </select>
                <Button type="submit" className="bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 w-full flex items-center justify-center p-3 h-full"><Search className="mr-2 h-5 w-5" /> Search</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

