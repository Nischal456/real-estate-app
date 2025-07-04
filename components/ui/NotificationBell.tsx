'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Mail, Phone, Circle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { EnquiryNotification } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<EnquiryNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"), 
      where("recipientId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as EnquiryNotification[];
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleNotificationClick = async (notification: EnquiryNotification) => {
    // Mark as read in the database
    if (!notification.read) {
      const notifRef = doc(db, "notifications", notification.id);
      await updateDoc(notifRef, { read: true });
    }
    // Navigate to the property page
    router.push(`/properties/${notification.propertyId}`);
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-100">
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg z-50 border max-h-[70vh] overflow-y-auto">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {/* Optional: Add a "Mark all as read" button here */}
          </div>
          {notifications.length > 0 ? (
            <div>
              {notifications.map(notif => (
                <div key={notif.id} onClick={() => handleNotificationClick(notif)} className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    {!notif.read && <Circle className="w-2.5 h-2.5 text-blue-500 mt-1.5 mr-3 flex-shrink-0" fill="currentColor" />}
                    <div className={`flex-grow ${notif.read ? 'ml-[22px]' : ''}`}>
                      <p className="font-semibold text-sm text-gray-900">{notif.senderName}</p>
                      <p className="text-sm text-gray-600 truncate">
                        enquired about: <span className="font-medium text-gray-700">{notif.propertyTitle}</span>
                      </p>
                      <div className="mt-2 space-y-1 text-xs text-gray-500">
                        <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-2" /> {notif.senderEmail}</p>
                        <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-2" /> {notif.senderPhone}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 text-right">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-4 text-sm text-gray-500 text-center">You have no notifications.</p>
          )}
        </div>
      )}
    </div>
  );
}