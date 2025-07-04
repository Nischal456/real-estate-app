'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2, AlertCircle, CheckCircle, Phone, Mail, Briefcase } from 'lucide-react';
import { Property } from '@/types';
import Image from 'next/image';

interface EnquiryFormProps {
  property: Property;
}

export function EnquiryForm({ property }: EnquiryFormProps) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [message, setMessage] = useState(`Hi, I am interested in the property: ${property.title}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: property.ownerId,
          senderName, senderEmail, senderPhone, message,
          propertyId: property.id, propertyTitle: property.title,
        }),
      });
      if (!response.ok) throw new Error("Failed to send enquiry. Please try again.");
      setSuccess("Your enquiry has been sent successfully!");
      setSenderName(''); setSenderEmail(''); setSenderPhone('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <div className="flex items-center mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-200">
          <Image src={property.ownerPhotoUrl || '/default-avatar.png'} alt={property.ownerName || 'Owner photo'} layout="fill" objectFit="cover" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{property.ownerName}</h3>
          <p className="text-sm text-gray-500 flex items-center">
            <Briefcase className="w-3.5 h-3.5 mr-1.5" />
            {property.ownerRole || 'Owner / Agent'}
          </p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {property.ownerPhoneNumber && (
            <div className="flex items-center text-gray-800 p-3 bg-gray-50 rounded-md text-sm">
                <Phone className="w-4 h-4 mr-3 text-[#3fa8e4]" />
                <span className="font-semibold">{property.ownerPhoneNumber}</span>
            </div>
        )}
        {property.ownerEmail && (
            <div className="flex items-center text-gray-800 p-3 bg-gray-50 rounded-md text-sm">
                <Mail className="w-4 h-4 mr-3 text-[#3fa8e4]" />
                <span className="font-semibold">{property.ownerEmail}</span>
            </div>
        )}
      </div>

      <h4 className="font-semibold text-gray-700 mb-3 border-t pt-4">Contact For Enquiry</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" placeholder="Your full name" value={senderName} onChange={(e) => setSenderName(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" />
        <input type="email" placeholder="Your email address" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" />
        <input type="tel" placeholder="Your phone number" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]" />
        <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fa8e4]"></textarea>
        {error && <div className="text-red-500 flex items-center text-sm"><AlertCircle className="w-4 h-4 mr-2"/>{error}</div>}
        {success && <div className="text-green-600 flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2"/>{success}</div>}
        <Button type="submit" disabled={loading} className="w-full bg-[#3fa8e4] hover:bg-[#3fa8e4]/90">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}
