'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User, Edit, LogOut, ChevronDown, Building } from 'lucide-react';

export function ProfileDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200">
          <Image src={user.photoURL || '/default-avatar.png'} alt="User profile" layout="fill" objectFit="cover" />
        </div>
        <span className="hidden md:block font-semibold text-gray-700">{user.displayName || 'Profile'}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border">
          <div className="p-2 border-b">
            <p className="font-semibold text-gray-800">{user.displayName}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <Link href="/my-properties" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Building className="w-4 h-4 mr-3" /> My Properties
            </Link>
            <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Edit className="w-4 h-4 mr-3" /> Edit Profile
            </Link>
            <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              <LogOut className="w-4 h-4 mr-3" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}