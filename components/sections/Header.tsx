'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { ProfileDropdown } from '@/components/ui/ProfileDropdown';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/properties', label: 'Properties' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  const linkVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1 + 0.3,
        type: 'spring',
        stiffness: 120,
      },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          hasScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-white'
        }`}
      >
        <nav className="container mx-auto px-4 lg:px-6 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Company Logo" width={180} height={40} className="h-10 w-auto" />
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link, i) => (
              <motion.div key={link.href} custom={i} initial="hidden" animate="visible" variants={linkVariants}>
                <Link
                  href={link.href}
                  className="text-gray-700 font-medium px-4 py-2 rounded-full transition-all duration-300 hover:text-white hover:bg-[#3fa8e4]"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="hidden lg:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="/add-property">
              <Button className="bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 duration-300">
                Post Property
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <ProfileDropdown />
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="rounded-full border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
                  Login / Signup
                </Button>
              </Link>
            )}
          </motion.div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 focus:outline-none z-50 relative"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
<AnimatePresence>
  {isMenuOpen && (
    <motion.div
      key="mobile-menu" // <-- ADD THIS LINE
      variants={mobileMenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="lg:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-xl z-40 p-6"
    >
      <div className="flex flex-col space-y-6 mt-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-800 text-lg font-semibold text-center py-3 rounded-lg hover:bg-[#3fa8e4]/10 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <hr />
        <div className="flex flex-col items-center space-y-4 pt-4">
          <Link href="/add-property" className="w-full" onClick={() => setIsMenuOpen(false)}>
            <Button className="w-full bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 text-white font-semibold rounded-full py-3 text-base">
              Post Property
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center justify-center space-x-6 pt-4">
              <NotificationBell />
              <ProfileDropdown />
            </div>
          ) : (
            <Link href="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full rounded-full text-base py-3">
                Login / Signup
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}