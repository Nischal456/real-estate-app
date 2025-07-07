'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Mail, Phone, Circle, BellOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { EnquiryNotification } from '@/types';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for the main dropdown panel
const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } },
};

// Variants for staggering the list items
const listVariants = {
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<EnquiryNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "notifications"), where("recipientId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as EnquiryNotification[];
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: EnquiryNotification) => {
    if (!notification.read) {
      const notifRef = doc(db, "notifications", notification.id);
      await updateDoc(notifRef, { read: true });
    }
    router.push(`/properties/${notification.propertyId}`);
    setIsOpen(false);
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    const unreadNotifications = notifications.filter(n => !n.read);
    unreadNotifications.forEach(notif => {
        const notifRef = doc(db, 'notifications', notif.id);
        batch.update(notifRef, { read: true });
    });
    await batch.commit();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button 
        onClick={() => setIsOpen(!isOpen)} 
        whileTap={{ scale: 0.9 }}
        className="relative p-2 rounded-full hover:bg-slate-200/60 transition-colors"
      >
        <Bell className="w-6 h-6 text-slate-600" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key={unreadCount}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="absolute top-0.5 right-0.5 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 mt-3 w-96 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl z-50 border border-slate-200/50 max-h-[70vh] flex flex-col"
          >
            <div className="p-4 border-b border-slate-200/80 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-xl">
              <h3 className="font-bold text-base text-slate-800">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto">
              {notifications.length > 0 ? (
                <motion.div variants={listVariants}>
                  {notifications.map(notif => (
                    <motion.div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      variants={itemVariants}
                      className={`p-4 border-b border-slate-200/50 cursor-pointer transition-colors ${notif.read ? 'hover:bg-slate-200/40' : 'bg-blue-500/5 hover:bg-blue-500/10'}`}
                    >
                      <div className="flex items-start gap-3">
                        <AnimatePresence>
                          {!notif.read && (
                            <motion.div exit={{ scale: 0 }} transition={{ duration: 0.3 }}>
                              <Circle className="w-2.5 h-2.5 text-blue-500 mt-1.5 flex-shrink-0" fill="currentColor" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className={`flex-grow ${notif.read && !isOpen ? 'pl-[22px]' : ''}`}>
                          <p className="font-semibold text-sm text-slate-900">{notif.senderName}</p>
                          <p className="text-sm text-slate-600">
                            enquired about: <span className="font-medium text-slate-800">{notif.propertyTitle}</span>
                          </p>
                          <div className="mt-2.5 space-y-1.5 text-xs text-slate-500">
                            <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-2" /> {notif.senderEmail}</p>
                            <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-2" /> {notif.senderPhone}</p>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 text-right">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <BellOff className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-sm font-semibold text-slate-600">No Notifications Yet</p>
                  <p className="text-xs text-slate-400 mt-1">New enquiries will appear here.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}