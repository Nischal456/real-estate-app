export type Property = {
  id: string;
  title: string;
  description: string;
  propertyType: 'House' | 'Apartment' | 'Land';
  status: 'For Sale' | 'For Rent';
  price: string;
  location: string;
  featuredImageUrl: string | null;
  imageUrls: string[];
  createdAt: string;

  // Owner Information
  ownerId: string;
  ownerName: string;
  ownerPhotoUrl: string | null;
  ownerPhoneNumber?: string;
  ownerEmail?: string;
  ownerRole?: 'Owner' | 'Agent' | 'User';

  // Fields for House/Apartment
  beds?: string;
  baths?: string;
  sqft?: string;
  facilities?: string[];

  // Fields for Land
  landArea?: string;
  landFace?: string;
  roadAccess?: string;
  roadWidth?: string;
};

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'Owner' | 'Agent' | 'User';
  phoneNumber: string | null;
};

export type EnquiryNotification = {
  id: string;
  recipientId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
  propertyId: string;
  propertyTitle: string;
  read: boolean;
  createdAt: string;
};
