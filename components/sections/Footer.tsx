import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DreamHomes</h3>
            <p className="text-gray-400">Your partner in finding the perfect property. Committed to excellence and service.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2"><Link href="/properties" className="text-gray-400 hover:text-white">Properties</Link></li>
              <li className="mb-2"><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li className="mb-2"><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li className="mb-2"><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400 mb-2">123 Real Estate Ave, Property City</p>
            <p className="text-gray-400 mb-2">contact@dreamhomes.com</p>
            <p className="text-gray-400">(123) 456-7890</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Linkedin /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} DreamHomes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
