'use client';

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Button } from '@/components/ui/Button';
import { Loader2, CheckCircle, AlertCircle, Upload, XCircle, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
  const formRef = useRef<HTMLFormElement>(null);
  
  const [propertyType, setPropertyType] = useState<'House' | 'Apartment' | 'Land'>('House');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const combinedFiles = [...imageFiles, ...newFiles];
      
      if (combinedFiles.length > 5) {
        setError('You can upload a maximum of 5 images.');
        return;
      }
      const uniqueFiles = Array.from(new Map(combinedFiles.map(file => [`${file.name}-${file.size}`, file])).values());
      setImageFiles(uniqueFiles);
      
      event.target.value = '';
    }
  };
  
  const removeImage = (index: number) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(imageFiles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImageFiles(items);
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
      
      formData.delete('images');
      imageFiles.forEach(file => formData.append('images', file));
      
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
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#3fa8e4]" />
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
                <p className="text-xs text-gray-500 mb-3">Drag and drop to reorder. The first image will be the featured one.</p>
                
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="image-previews" direction="horizontal">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps} 
                        ref={provided.innerRef}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4"
                      >
                        {imageFiles.map((file, index) => (
                          <Draggable key={`${file.name}-${index}`} draggableId={`${file.name}-${index}`} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`relative aspect-square border-2 rounded-md ${snapshot.isDragging ? 'border-blue-500 shadow-lg' : 'border-transparent'}`}
                              >
                                <Image src={URL.createObjectURL(file)} alt="Preview" layout="fill" objectFit="cover" className="rounded-md" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors z-10">
                                  <XCircle size={20} />
                                </button>
                                {index === 0 && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 font-semibold">
                                    Featured
                                  </div>
                                )}
                                <div className="absolute top-1 left-1 bg-white/70 p-0.5 rounded-sm cursor-grab">
                                    <GripVertical size={16} className="text-gray-600" />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

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
