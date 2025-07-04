'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { ProfileDropdown } from '@/components/ui/ProfileDropdown'; // Import the new component
import { NotificationBell } from '@/components/ui/NotificationBell';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Company Logo" width={180} height={40} className="h-10 w-auto" />
        </Link>
        
        <div className="hidden lg:flex items-center space-x-8">
          <Link href="/properties" className="text-gray-700 font-medium hover:text-[#3fa8e4] transition-colors">Properties</Link>
          <Link href="/about" className="text-gray-700 font-medium hover:text-[#3fa8e4] transition-colors">About Us</Link>
          <Link href="/contact" className="text-gray-700 font-medium hover:text-[#3fa8e4] transition-colors">Contact</Link>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <Link href="/add-property">
            <Button className="bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 text-white font-semibold">Post Property</Button>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-2">
              <NotificationBell /> {/* Add the bell icon here */}
              <ProfileDropdown />
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-semibold">
              Login/Signup
            </Link>
          )}
        </div>
        <button className="lg:hidden text-gray-600 focus:outline-none">
          <Menu />
        </button>
      </nav>
    </header>
  );
}

