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

// Reusable form components
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: React.ReactNode;
}
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

function FormInput({ label, id, ...props }: InputProps) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" {...props} />
      </div>
    );
}
function FormSelect({ label, id, children, ...props }: SelectProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select id={id} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" {...props}>
                {children}
            </select>
        </div>
    )
}
function FormTextarea({ label, id, ...props }: TextareaProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <textarea id={id} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" {...props} />
        </div>
    )
}


export default function EditPropertyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Partial<Property> | null>(null);
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
        console.error(err);
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
    setProperty(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProperty(prev => {
      if (!prev) return null;
      const currentFacilities = prev.facilities || [];
      if (checked) {
        return { ...prev, facilities: [...currentFacilities, value] };
      } else {
        return { ...prev, facilities: currentFacilities.filter(f => f !== value) };
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const docRef = doc(db, "properties", id);
      const { id: propertyId, ...updateData } = property || {};
      if (!propertyId) throw new Error("Property ID is missing.");
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
  
  if (error || !property) {
    return <div className="flex h-screen items-center justify-center p-4 text-center text-red-500"><AlertCircle className="w-8 h-8 mr-4"/>{error || "Could not load property data."}</div>;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Property</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput id="title" name="title" label="Listing Title" value={property.title || ''} onChange={handleChange} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect id="propertyType" name="propertyType" label="Property Type" value={property.propertyType || 'House'} onChange={handleChange}>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Land">Land</option>
              </FormSelect>
              <FormSelect id="status" name="status" label="Listing Status" value={property.status || 'For Sale'} onChange={handleChange} required>
                <option>For Sale</option>
                <option>For Rent</option>
              </FormSelect>
            </div>

            {property.propertyType === 'Land' ? (
              <div className="space-y-6 pt-4 border-t">
                <h2 className="text-xl font-semibold text-gray-700">Land Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput id="landArea" name="landArea" label="Land Area (in Aana or Ropani)" value={property.landArea || ''} onChange={handleChange} required />
                  <FormInput id="location" name="location" label="Land Location" value={property.location || ''} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <FormSelect id="landFace" name="landFace" label="Land Face" value={property.landFace || 'East'} onChange={handleChange} required>
                      <option>East</option><option>West</option><option>North</option><option>South</option>
                      <option>North-East</option><option>North-West</option><option>South-East</option><option>South-West</option>
                  </FormSelect>
                  <FormSelect id="roadAccess" name="roadAccess" label="Road Access" value={property.roadAccess || 'Pitched'} onChange={handleChange} required>
                      <option>Pitched</option><option>Gravel</option><option>Soil</option>
                  </FormSelect>
                </div>
                <FormInput id="roadWidth" name="roadWidth" label="Road Width (in feet)" value={property.roadWidth || ''} onChange={handleChange} required />
              </div>
            ) : (
              <div className="space-y-6 pt-4 border-t">
                <h2 className="text-xl font-semibold text-gray-700">Property Details</h2>
                <FormInput id="location" name="location" label="Location / Address" value={property.location || ''} onChange={handleChange} required />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormInput id="beds" name="beds" label="Bedrooms" type="number" value={property.beds || ''} onChange={handleChange} required />
                  <FormInput id="baths" name="baths" label="Bathrooms" type="number" value={property.baths || ''} onChange={handleChange} required />
                  <FormInput id="sqft" name="sqft" label="Built Area (sqft)" type="number" value={property.sqft || ''} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Extra Facilities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {['24hr Water', 'Parking', 'Security', 'Electricity Backup', 'Garden'].map(facility => (
                      <label key={facility} className="flex items-center space-x-2">
                        <input type="checkbox" name="facilities" value={facility} checked={(property.facilities || []).includes(facility)} onChange={handleCheckboxChange} className="h-4 w-4 text-[#3fa8e4] border-gray-300 rounded focus:ring-[#3fa8e4]" />
                        <span>{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
               <FormInput id="price" name="price" label="Price (in NPR)" type="number" value={property.price || ''} onChange={handleChange} required />
            </div>
            
            <FormTextarea id="description" name="description" label="Description" value={property.description || ''} onChange={handleChange} rows={5} />
            
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
