'use client';

import { useEffect, useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, Upload, XCircle } from 'lucide-react';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Reusable form components
function FormInput({ label, id, ...props }: any) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input id={id} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" {...props} />
    </div>
  );
}
function FormSelect({ label, id, children, ...props }: any) {
  return (
      <div>
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <select id={id} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" {...props}>
              {children}
          </select>
      </div>
  )
}


export default function AddPropertyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [propertyType, setPropertyType] = useState<'House' | 'Apartment' | 'Land'>('House');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);


  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (!user.emailVerified) {
        setIsVerified(false);
      } else {
        setIsVerified(true);
      }
    }
  }, [user, authLoading, router]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (imageFiles.length + files.length > 5) {
        setError('You can upload a maximum of 5 images.');
        return;
      }
      setImageFiles(prevFiles => [...prevFiles, ...files]);
    }
  };
  
  const removeImage = (index: number) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !formRef.current) {
        setError("An unexpected error occurred. Please try again.");
        return;
    }
    if (imageFiles.length === 0) {
      setError('Please select at least one image.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userProfile = userDocSnap.data();

      const formData = new FormData(formRef.current);
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
      
      formData.append('ownerId', user.uid);
      formData.append('ownerName', user.displayName || 'Anonymous User');
      formData.append('ownerPhotoUrl', user.photoURL || '');
      formData.append('ownerPhoneNumber', userProfile?.phoneNumber || ''); 
      
      const token = await user.getIdToken();
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#3fa8e4]" />
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center p-4">
         <h1 className="text-2xl font-bold text-red-600">Email Not Verified</h1>
         <p className="mt-2 text-gray-600">You must verify your email address before you can add a property.</p>
         <p className="mt-1 text-gray-500">Please check your inbox for a verification link.</p>
         <Button onClick={() => router.push('/')} className="mt-6 bg-[#3fa8e4] hover:bg-[#3fa8e4]/90">Go to Homepage</Button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 py-12">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">List Your Property</h1>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <FormInput name="title" label="Listing Title" placeholder="e.g., Beautiful Modern Villa / Prime Plot of Land" required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormSelect name="propertyType" label="Property Type" value={propertyType} onChange={(e: ChangeEvent<HTMLSelectElement>) => setPropertyType(e.target.value as any)}>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Land">Land</option>
                        </FormSelect>
                        <FormSelect name="status" label="Listing Status" required>
                            <option>For Sale</option>
                            <option>For Rent</option>
                        </FormSelect>
                    </div>

                    {propertyType === 'Land' ? (
                        <div className="space-y-6 pt-4 border-t">
                        <h2 className="text-xl font-semibold text-gray-700">Land Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput name="landArea" label="Land Area (in Aana or Ropani)" placeholder="e.g., 4 Aana" required />
                            <FormInput name="location" label="Land Location" placeholder="e.g., Budhanilkantha, Kathmandu" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormSelect name="landFace" label="Land Face" required>
                                <option>East</option><option>West</option><option>North</option><option>South</option>
                                <option>North-East</option><option>North-West</option><option>South-East</option><option>South-West</option>
                            </FormSelect>
                            <FormSelect name="roadAccess" label="Road Access" required>
                                <option>Pitched</option><option>Gravel</option><option>Soil</option>
                            </FormSelect>
                        </div>
                        <FormInput name="roadWidth" label="Road Width (in feet)" placeholder="e.g., 13 ft" required />
                        </div>
                    ) : (
                        <div className="space-y-6 pt-4 border-t">
                        <h2 className="text-xl font-semibold text-gray-700">Property Details</h2>
                        <FormInput name="location" label="Location / Address" placeholder="e.g., 123 Dream Lane, Realville" required />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormInput name="beds" label="Bedrooms" type="number" placeholder="e.g., 4" required />
                            <FormInput name="baths" label="Bathrooms" type="number" placeholder="e.g., 3" required />
                            <FormInput name="sqft" label="Built Area (sqft)" type="number" placeholder="e.g., 2400" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Extra Facilities</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                            {['24hr Water', 'Parking', 'Security', 'Electricity Backup', 'Garden'].map(facility => (
                                <label key={facility} className="flex items-center space-x-2">
                                <input type="checkbox" name="facilities" value={facility} className="h-4 w-4 text-[#3fa8e4] border-gray-300 rounded focus:ring-[#3fa8e4]" />
                                <span>{facility}</span>
                                </label>
                            ))}
                            </div>
                        </div>
                        </div>
                    )}

                    <div className="pt-4 border-t">
                        <FormInput name="price" label="Price (in NPR)" type="number" placeholder="e.g., 25000000" required />
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" id="description" rows={4} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" placeholder="Describe the property..."></textarea>
                    </div>

                    <div className="pt-4 border-t">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Property Images (up to 5)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                        {imageFiles.map((file, index) => (
                            <div key={index} className="relative aspect-square">
                            <Image src={URL.createObjectURL(file)} alt="Preview" layout="fill" objectFit="cover" className="rounded-md" />
                            <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors">
                                <XCircle size={20} />
                            </button>
                            </div>
                        ))}
                        </div>
                        {imageFiles.length < 5 && (
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-[#3fa8e4] hover:text-[#3fa8e4]/80 focus-within:outline-none">
                                <span>Upload files</span>
                                <input id="images" name="images" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" multiple />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={loading || success} className="w-full justify-center bg-[#3fa8e4] hover:bg-[#3fa8e4]/90">
                        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {success && <CheckCircle className="mr-2 h-5 w-5" />}
                        {loading ? 'Submitting...' : success ? 'Property Listed!' : 'Add Property'}
                        </Button>
                    </div>
                    {error && (
                        <div className="flex items-center text-red-600 bg-red-100 p-3 rounded-md">
                        <AlertCircle className="mr-2" /> {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
