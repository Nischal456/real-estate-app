'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Property } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';

export default function MyPropertiesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchProperties = async () => {
      if (user) {
        setLoading(true);
        try {
          const q = query(collection(db, "properties"), where("ownerId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const userProperties = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[];
          setProperties(userProperties);
        } catch (fetchError) {
          console.error(fetchError);
          setError("Failed to fetch your properties.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProperties();
  }, [user, authLoading, router]);

  const handleDelete = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
    if (!user) {
      alert("You must be logged in to delete a property.");
      return;
    }
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to delete property.");
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      alert("Property deleted successfully.");
    } catch (deleteError) {
      console.error(deleteError);
      alert("Failed to delete property. Please try again.");
    }
  };

  if (authLoading || loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-[#3fa8e4]" /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Properties</h1>
        {error && <div className="text-red-500 p-4 bg-red-100 rounded-md flex items-center"><AlertCircle className="w-5 h-5 mr-2" />{error}</div>}
        <div className="space-y-6">
          {properties.length > 0 ? (
            properties.map(prop => (
              <div key={prop.id} className="flex flex-col md:flex-row items-center bg-white p-4 rounded-lg shadow-md border gap-6">
                <div className="relative w-full md:w-48 h-48 md:h-32 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                  {prop.featuredImageUrl ? (<Image src={prop.featuredImageUrl} alt={prop.title} layout="fill" objectFit="cover" />) : (<div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>)}
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-xl font-semibold text-gray-800">{prop.title}</h2>
                  <p className="text-sm text-gray-500">{prop.location}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 mt-4 md:mt-0">
                  <Link href={`/edit-property/${prop.id}`} className="flex items-center gap-2 text-blue-600 hover:underline px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"><Edit className="w-5 h-5" /> Edit</Link>
                  <button onClick={() => handleDelete(prop.id)} className="flex items-center gap-2 text-red-600 hover:underline px-4 py-2 rounded-md hover:bg-red-50 transition-colors"><Trash2 className="w-5 h-5" /> Delete</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-lg">
                <p>You have not listed any properties yet.</p>
                <Link href="/add-property"><Button className="mt-4 bg-[#3fa8e4] hover:bg-[#3fa8e4]/90">List a Property</Button></Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
