import { adminDb } from '@/lib/firebase-admin';
import { Property, UserProfile, EnquiryNotification } from '@/types';
import { AdminDashboardClient } from './AdminDashboardClient';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  try {
    // 1. Fetch properties
    const propertiesSnap = await adminDb.collection("properties").get();
    const properties: Property[] = propertiesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Property));

    // 2. Fetch enquiries (stored in "notifications" collection)
    const notificationsSnap = await adminDb.collection("notifications").get();
    const notifications: EnquiryNotification[] = notificationsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EnquiryNotification));

    // 3. Fetch users
    const usersSnap = await adminDb.collection("users").get();
    const users: UserProfile[] = usersSnap.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as UserProfile));

    // Sort notifications and properties by date descending
    properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
      <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AdminDashboardClient 
            initialProperties={properties} 
            initialNotifications={notifications} 
            initialUsers={users} 
          />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error loading admin page data:", error);
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md border border-gray-100">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Failed to Load Dashboard</h1>
            <p className="text-gray-500">There was a database error loading the administrative data. Please check your credentials and try again.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
