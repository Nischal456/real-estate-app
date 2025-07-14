'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { Loader2, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'Owner' | 'Agent' | 'User'>('User');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisplayName(data.displayName || '');
          setPhoneNumber(data.phoneNumber || '');
          setRole(data.role || 'User');
        } else {
          setDisplayName(user.displayName || '');
        }
        setImagePreview(user.photoURL);
      };
      fetchProfile();
    } else {
      router.push('/login');
    }
  }, [user, router]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let newPhotoURL = user.photoURL;
      if (profileImageFile) {
        const formData = new FormData();
        formData.append('image', profileImageFile);
        const response = await fetch('/api/upload-profile-photo', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Image upload failed');
        newPhotoURL = result.imageUrl;
      }
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName, photoURL: newPhotoURL });
      }
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName,
        email: user.email,
        phoneNumber,
        role,
        photoURL: newPhotoURL,
      }, { merge: true });
      setSuccess("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Your Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                <Image src={imagePreview || '/default-avatar.png'} alt="Profile Preview" layout="fill" objectFit="cover" />
              </div>
              <label htmlFor="profile-image-upload" className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
                <Upload className="w-4 h-4 mr-2 inline-block"/>Change Photo
              </label>
              <input id="profile-image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </div>
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-[#3fa8e4]" />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-[#3fa8e4]" />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a...</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value as 'Owner' | 'Agent' | 'User')} className="mt-1 w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-[#3fa8e4]">
                <option value="User">General User</option>
                <option value="Owner">Property Owner</option>
                <option value="Agent">Real Estate Agent</option>
              </select>
            </div>
            {error && <div className="text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-2"/>{error}</div>}
            {success && <div className="text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-2"/>{success}</div>}
            <Button type="submit" disabled={loading} className="w-full bg-[#3fa8e4] hover:bg-[#3fa8e4]/90">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Save Changes'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

