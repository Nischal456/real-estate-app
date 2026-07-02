'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Property, UserProfile, EnquiryNotification } from '@/types';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Building2, 
  Inbox, 
  Users, 
  Search, 
  Trash2, 
  Eye, 
  Check, 
  MapPin, 
  Mail, 
  Phone, 
  Shield, 
  ArrowLeft, 
  ExternalLink, 
  Lock, 
  Loader2,
  Calendar,
  Briefcase,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { formatNpr } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardClientProps {
  initialProperties: Property[];
  initialNotifications: EnquiryNotification[];
  initialUsers: UserProfile[];
}

export function AdminDashboardClient({ 
  initialProperties, 
  initialNotifications, 
  initialUsers 
}: AdminDashboardClientProps) {
  const { user, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'enquiries' | 'users'>('overview');
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [notifications, setNotifications] = useState<EnquiryNotification[]>(initialNotifications);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdatingUser, setIsUpdatingUser] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search & Filter States
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('All');
  
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'read' | 'unread'>('all');
  
  const [userSearch, setUserSearch] = useState('');

  // 1. Authorization checks
  if (authLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#3fa8e4]" />
        <p className="text-gray-500 font-medium">Checking authorization status...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100"
        >
          <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You must be logged in as an administrator or agent to view the E-Bazar Securities dashboard.</p>
          <Link href="/login" className="inline-block w-full bg-[#3fa8e4] hover:bg-[#3596cc] text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors">
            Log In / Sign Up
          </Link>
        </motion.div>
      </div>
    );
  }

  // Find user details in initialUsers list
  const userProfile = users.find(u => u.uid === user.uid);
  const isMasterAdmin = user.email === 'ebazarsecurities@gmail.com';
  const isAuthorized = isMasterAdmin || userProfile?.role === 'Owner' || userProfile?.role === 'Agent';

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100"
        >
          <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Restricted Access</h2>
          <p className="text-gray-500 mb-6">Your account does not have administrative privileges. Only E-Bazar Securities agents or owners are allowed.</p>
          <div className="space-y-3">
            <Link href="/" className="inline-block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors">
              Go back Home
            </Link>
            <p className="text-xs text-gray-400">If you believe this is an error, please update your profile role settings.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Helper functions
  const getAuthToken = async () => {
    return await user.getIdToken();
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to permanently delete this property listing? This action cannot be undone.')) return;
    setIsDeleting(propertyId);
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
      } else {
        alert('Failed to delete property. Check your authorization.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during deletion.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdateRole = async (targetUid: string, newRole: 'Owner' | 'Agent' | 'User') => {
    if (targetUid === user.uid) {
      alert('You cannot update your own role.');
      return;
    }
    setIsUpdatingUser(targetUid);
    try {
      const token = await getAuthToken();
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid: targetUid, role: newRole })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, role: newRole } : u));
      } else {
        const errorText = await res.text();
        alert(`Failed to update role: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating the role.');
    } finally {
      setIsUpdatingUser(null);
    }
  };

  const handleMarkEnquiryRead = async (enquiryId: string, read: boolean) => {
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/notifications/${enquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ read })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === enquiryId ? { ...n, read } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEnquiry = async (enquiryId: string) => {
    if (!confirm('Are you sure you want to delete this enquiry notification?')) return;
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/notifications/${enquiryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== enquiryId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Stats Aggregation
  const totalPropertiesCount = properties.length;
  const totalEnquiriesCount = notifications.length;
  const totalUsersCount = users.length;
  
  const forSaleCount = properties.filter(p => p.status === 'For Sale').length;
  const forRentCount = properties.filter(p => p.status === 'For Rent').length;
  
  const houseCount = properties.filter(p => p.propertyType === 'House').length;
  const apartmentCount = properties.filter(p => p.propertyType === 'Apartment').length;
  const landCount = properties.filter(p => p.propertyType === 'Land').length;

  const totalTypes = houseCount + apartmentCount + landCount || 1;
  const housePct = (houseCount / totalTypes) * 100;
  const apartmentPct = (apartmentCount / totalTypes) * 100;
  const landPct = (landCount / totalTypes) * 100;

  // 4. Filtering Logic
  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
                          p.location.toLowerCase().includes(propertySearch.toLowerCase()) ||
                          (p.ownerName && p.ownerName.toLowerCase().includes(propertySearch.toLowerCase()));
    const matchesType = propertyTypeFilter === 'All' || p.propertyType === propertyTypeFilter;
    const matchesStatus = propertyStatusFilter === 'All' || p.status === propertyStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredEnquiries = notifications.filter(n => {
    if (enquiryFilter === 'read') return n.read === true;
    if (enquiryFilter === 'unread') return n.read === false;
    return true;
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.displayName && u.displayName.toLowerCase().includes(userSearch.toLowerCase())) ||
                          (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
                          (u.phoneNumber && u.phoneNumber.includes(userSearch));
    return matchesSearch;
  });

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'properties', label: 'Properties', icon: <Building2 size={18} /> },
    { id: 'enquiries', label: 'Enquiries', icon: <Inbox size={18} /> },
    { id: 'users', label: 'User Roles', icon: <Users size={18} /> },
  ] as const;

  return (
    <div className="flex flex-col lg:flex-row min-h-[75vh] gap-8 mt-2 relative">
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          <Shield className="text-[#3fa8e4] w-6 h-6" />
          <span className="font-bold text-gray-800">E-Bazar Admin</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
          aria-label="Toggle Navigation"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-0 z-40 bg-white/95 backdrop-blur-xl p-6 flex flex-col justify-between border-r border-gray-100 transition-all duration-300 lg:relative lg:inset-auto lg:z-0 lg:bg-white lg:backdrop-blur-none lg:w-64 lg:p-6 lg:rounded-2xl lg:shadow-sm
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8">
          <div className="hidden lg:flex items-center space-x-2 border-b border-gray-50 pb-4">
            <Shield className="text-[#3fa8e4] w-6 h-6" />
            <span className="font-bold text-gray-800 tracking-tight text-lg">Admin Portal</span>
          </div>

          <nav className="flex flex-col space-y-1">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-[#3fa8e4]/10 text-[#3fa8e4]' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#3fa8e4]/10 flex items-center justify-center text-[#3fa8e4] font-bold overflow-hidden border border-gray-100">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.displayName?.charAt(0) || user.email?.charAt(0) || 'A'
              )}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">{user.displayName || 'Admin User'}</p>
              <span className="inline-block text-[10px] bg-[#3fa8e4]/10 text-[#3fa8e4] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {isMasterAdmin ? 'Master Owner' : userProfile?.role || 'Agent'}
              </span>
            </div>
          </div>

          <Link href="/" className="flex items-center justify-center space-x-2 text-xs font-semibold text-gray-500 hover:text-gray-800 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={14} />
            <span>Go back to site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview Dashboard</h2>
                  <p className="text-gray-500 text-sm mt-1">Real-time statistics and metrics summary for E-Bazar Securities.</p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-[#3fa8e4]/10 text-[#3fa8e4] rounded-xl"><Building2 size={24} /></div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Properties</p>
                      <h3 className="text-2xl font-extrabold text-gray-800 mt-1">{totalPropertiesCount}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-pink-50 text-pink-500 rounded-xl"><Inbox size={24} /></div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Enquiries</p>
                      <h3 className="text-2xl font-extrabold text-gray-800 mt-1">{totalEnquiriesCount}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-green-50 text-green-500 rounded-xl"><Briefcase size={24} /></div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active for Sale</p>
                      <h3 className="text-2xl font-extrabold text-gray-800 mt-1">{forSaleCount}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Calendar size={24} /></div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active for Rent</p>
                      <h3 className="text-2xl font-extrabold text-gray-800 mt-1">{forRentCount}</h3>
                    </div>
                  </div>

                </div>

                {/* Secondary Visual Charts Block */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Category Pie/Bar breakdown card */}
                  <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-3 mb-5">Listing Distribution</h4>
                      <div className="space-y-4">
                        
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1.5">
                            <span className="text-gray-600">Houses</span>
                            <span className="text-gray-800">{houseCount} ({Math.round(housePct)}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#3fa8e4] h-full rounded-full" style={{ width: `${housePct}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1.5">
                            <span className="text-gray-600">Apartments</span>
                            <span className="text-gray-800">{apartmentCount} ({Math.round(apartmentPct)}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${apartmentPct}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1.5">
                            <span className="text-gray-600">Lands</span>
                            <span className="text-gray-800">{landCount} ({Math.round(landPct)}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${landPct}%` }} />
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="mt-8 text-center text-xs text-gray-400 font-medium">
                      Registered users & agents count: <span className="font-bold text-gray-800">{totalUsersCount}</span>
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-3 mb-5">Recent Activity</h4>
                    
                    <div className="space-y-5">
                      {properties.slice(0, 3).map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3.5 hover:bg-gray-50/50 rounded-xl border border-gray-50 transition-colors">
                          <div className="flex items-center space-x-3.5 min-w-0">
                            <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                              <img src={p.featuredImageUrl || '/placeholder.co'} alt="" className="object-cover w-full h-full" />
                            </div>
                            <div className="text-left min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate">{p.title}</p>
                              <div className="flex items-center text-xs text-gray-400 space-x-2.5 mt-0.5">
                                <span className="capitalize">{p.propertyType}</span>
                                <span>&bull;</span>
                                <span className="flex items-center"><MapPin size={10} className="mr-0.5" />{p.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-[#3fa8e4]">
                              {p.status === 'For Rent' ? `Rs. ${formatNpr(p.price)}/mo` : `Rs. ${formatNpr(p.price)}`}
                            </p>
                            <span className="inline-block text-[9px] text-gray-400 font-medium mt-0.5">
                              {new Date(p.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {properties.length === 0 && (
                        <p className="text-center text-gray-400 py-6 text-sm">No properties added yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* PROPERTIES TAB */}
            {activeTab === 'properties' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Listings</h2>
                  <p className="text-gray-500 text-sm mt-1">Directly monitor, search, and delete property listings on E-Bazar Securities.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search by listing name, address, owner..."
                      value={propertySearch}
                      onChange={(e) => setPropertySearch(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#3fa8e4] focus:ring-1 focus:ring-[#3fa8e4] transition-all"
                    />
                  </div>
                  <div className="flex gap-4">
                    <select
                      value={propertyTypeFilter}
                      onChange={(e) => setPropertyTypeFilter(e.target.value)}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3fa8e4]"
                    >
                      <option value="All">All Types</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Land">Land</option>
                    </select>

                    <select
                      value={propertyStatusFilter}
                      onChange={(e) => setPropertyStatusFilter(e.target.value)}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3fa8e4]"
                    >
                      <option value="All">All Statuses</option>
                      <option value="For Sale">For Sale</option>
                      <option value="For Rent">For Rent</option>
                    </select>
                  </div>
                </div>

                {/* Table list */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100 font-bold">
                        <tr>
                          <th scope="col" className="px-6 py-4">Property</th>
                          <th scope="col" className="px-6 py-4">Location</th>
                          <th scope="col" className="px-6 py-4">Status & Price</th>
                          <th scope="col" className="px-6 py-4">Owner Info</th>
                          <th scope="col" className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProperties.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3.5">
                                <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                  <img src={p.featuredImageUrl || '/placeholder.co'} alt="" className="object-cover w-full h-full" />
                                </div>
                                <div className="text-left font-bold text-gray-800">
                                  <p className="truncate max-w-[200px]">{p.title}</p>
                                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium uppercase mt-1 inline-block">
                                    {p.propertyType}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              <span className="flex items-center truncate max-w-[150px]"><MapPin size={12} className="mr-1 text-gray-400" />{p.location}</span>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-700">
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 ${
                                p.status === 'For Sale' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {p.status}
                              </span>
                              <p className="text-xs font-semibold text-gray-500">
                                Rs. {formatNpr(p.price)}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-left">
                                <p className="text-sm font-semibold text-gray-700">{p.ownerName || 'User'}</p>
                                <span className="text-xs text-gray-400">{p.ownerPhoneNumber || 'No number'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Link 
                                  href={`/properties/${p.id}`} 
                                  target="_blank"
                                  className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl transition-colors"
                                  title="View Listing"
                                >
                                  <Eye size={16} />
                                </Link>
                                <button 
                                  onClick={() => handleDeleteProperty(p.id)}
                                  disabled={isDeleting === p.id}
                                  className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50"
                                  title="Delete Property"
                                >
                                  {isDeleting === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredProperties.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      No property listings found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ENQUIRIES TAB */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Enquiries</h2>
                  <p className="text-gray-500 text-sm mt-1">Review contact inquiries, view targets, and update inquiry status badges.</p>
                </div>

                {/* Filter Selector */}
                <div className="flex bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm max-w-sm">
                  {(['all', 'unread', 'read'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setEnquiryFilter(filter)}
                      className={`flex-1 text-center py-2 px-3 rounded-xl font-bold text-xs uppercase transition-all duration-300 ${
                        enquiryFilter === filter 
                          ? 'bg-[#3fa8e4] text-white shadow-sm' 
                          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* List View */}
                <div className="space-y-4">
                  {filteredEnquiries.map(enquiry => (
                    <div 
                      key={enquiry.id} 
                      className={`p-6 rounded-2xl border shadow-sm transition-all relative ${
                        enquiry.read 
                          ? 'bg-white border-gray-100' 
                          : 'bg-white border-[#3fa8e4]/20 ring-1 ring-[#3fa8e4]/5'
                      }`}
                    >
                      {!enquiry.read && (
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#3fa8e4] animate-pulse" />
                      )}
                      
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-gray-50 pb-4 mb-4">
                        <div className="text-left">
                          <h4 className="font-bold text-gray-800 text-base">{enquiry.senderName}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs mt-1 text-gray-400 font-semibold">
                            <span className="flex items-center"><Mail size={12} className="mr-1" />{enquiry.senderEmail}</span>
                            <span className="flex items-center"><Phone size={12} className="mr-1" />{enquiry.senderPhone}</span>
                            <span className="flex items-center"><Calendar size={12} className="mr-1" />{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Linked Property badge */}
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Target Listing</span>
                          <Link 
                            href={`/properties/${enquiry.propertyId}`} 
                            target="_blank"
                            className="inline-flex items-center text-xs font-bold text-[#3fa8e4] hover:text-[#3596cc] mt-0.5"
                          >
                            <span>{enquiry.propertyTitle || 'Property details'}</span>
                            <ExternalLink size={11} className="ml-1" />
                          </Link>
                        </div>
                      </div>

                      {/* Content message */}
                      <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed text-left bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                        {enquiry.message}
                      </p>

                      {/* Control buttons */}
                      <div className="flex items-center justify-end space-x-3 mt-4">
                        <button 
                          onClick={() => handleMarkEnquiryRead(enquiry.id, !enquiry.read)}
                          className="flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-[#3fa8e4] px-3 py-1.5 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <Check size={14} />
                          <span>{enquiry.read ? 'Mark Unread' : 'Mark Read'}</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteEnquiry(enquiry.id)}
                          className="flex items-center space-x-1.5 text-xs font-bold text-red-400 hover:text-red-600 px-3 py-1.5 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>

                    </div>
                  ))}
                  {filteredEnquiries.length === 0 && (
                    <p className="text-center text-gray-400 py-12">No inquiries found.</p>
                  )}
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Roles</h2>
                  <p className="text-gray-500 text-sm mt-1">Assign User, Agent, or Owner permissions to registered accounts.</p>
                </div>

                {/* Filter */}
                <div className="flex bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search accounts by name or email address..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#3fa8e4] focus:ring-1 focus:ring-[#3fa8e4] transition-all"
                    />
                  </div>
                </div>

                {/* User List Panel */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100 font-bold">
                        <tr>
                          <th scope="col" className="px-6 py-4">User Details</th>
                          <th scope="col" className="px-6 py-4">Email</th>
                          <th scope="col" className="px-6 py-4">Phone Number</th>
                          <th scope="col" className="px-6 py-4">Current Permission</th>
                          <th scope="col" className="px-6 py-4 text-right">Assign Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map(u => (
                          <tr key={u.uid} className="hover:bg-gray-50/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3.5">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden border border-gray-100 flex-shrink-0">
                                  {u.photoURL ? (
                                    <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    u.displayName?.charAt(0) || u.email?.charAt(0) || 'U'
                                  )}
                                </div>
                                <div className="text-left font-bold text-gray-800 truncate max-w-[180px]">
                                  {u.displayName || 'No Name'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-medium">
                              {u.email}
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              {u.phoneNumber || 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                u.role === 'Owner' 
                                  ? 'bg-purple-50 text-purple-600' 
                                  : u.role === 'Agent' 
                                  ? 'bg-[#3fa8e4]/10 text-[#3fa8e4]' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {u.role || 'User'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <select
                                value={u.role || 'User'}
                                disabled={isUpdatingUser === u.uid || u.uid === user.uid}
                                onChange={(e) => handleUpdateRole(u.uid, e.target.value as 'Owner' | 'Agent' | 'User')}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#3fa8e4] disabled:opacity-50"
                              >
                                <option value="User">User</option>
                                <option value="Agent">Agent</option>
                                <option value="Owner">Owner</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      No accounts matched the query.
                    </div>
                  )}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
