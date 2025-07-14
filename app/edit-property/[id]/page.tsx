'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Button } from '@/components/ui/Button';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Property } from '@/types';

interface EditInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

function FormInputForEdit({ label, id, ...props }: EditInputProps) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" {...props} />
      </div>
    );
}

export default function EditPropertyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Partial<Property>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().ownerId === user.uid) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Property not found or you do not have permission to edit it.");
        }
      } catch (err) {
        setError("Failed to fetch property data.");
      } finally {
        setLoading(false);
      }
    };
    if (id && user) {
      fetchProperty();
    }
  }, [id, user, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const docRef = doc(db, "properties", id);
      const { id: _, ...updateData } = property;
      await updateDoc(docRef, updateData);
      setSuccess("Property updated successfully!");
      setTimeout(() => router.push('/my-properties'), 1500);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-[#3fa8e4]" /></div>;
  }
  
  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500"><AlertCircle className="w-8 h-8 mr-4"/>{error}</div>;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Property</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInputForEdit name="title" label="Listing Title" value={property.title || ''} onChange={handleChange} required />
            <FormInputForEdit name="location" label="Location / Address" value={property.location || ''} onChange={handleChange} required />
            <FormInputForEdit name="price" label="Price (NPR)" type="number" value={property.price || ''} onChange={handleChange} required />
            {success && <div className="text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-2"/>{success}</div>}
            <Button type="submit" disabled={saving} className="w-full bg-[#3fa8e4] hover:bg-[#3fa8e4]/90">
              {saving ? <Loader2 className="animate-spin mx-auto" /> : 'Save Changes'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
