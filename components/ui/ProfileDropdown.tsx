'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User, Edit, LogOut, ChevronDown, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for the dropdown container
const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Variants for staggering the menu items
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

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
      <motion.button 
        onClick={() => setIsOpen(!isOpen)} 
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-200/60 transition-colors"
      >
        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-slate-300">
          <Image src={user.photoURL || '/default-avatar.png'} alt="User profile" layout="fill" objectFit="cover" />
        </div>
        <span className="hidden md:block font-semibold text-slate-700 pr-1">{user.displayName || 'Profile'}</span>
        <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
        >
            <ChevronDown className="w-5 h-5 text-slate-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 mt-3 w-64 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl z-50 border border-slate-200/50"
          >
            <div className="p-4 border-b border-slate-200/80">
              <p className="font-bold text-slate-800 text-base">{user.displayName}</p>
              <p className="text-sm text-slate-500 truncate">{user.email}</p>
            </div>
            <motion.div 
                className="py-2"
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              <motion.div variants={itemVariants}>
                <Link href="/my-properties" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-200/60 font-medium transition-colors">
                  <Building className="w-5 h-5 mr-3 text-slate-500" /> My Properties
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-200/60 font-medium transition-colors">
                  <Edit className="w-5 h-5 mr-3 text-slate-500" /> Edit Profile
                </Link>
              </motion.div>
               <motion.div variants={itemVariants}>
                <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 font-medium transition-colors">
                  <LogOut className="w-5 h-5 mr-3" /> Logout
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}