import { NextResponse as EnquiryNextResponse } from 'next/server';
import { db as enquiryDb } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const enquiryData = await request.json();
    if (!enquiryData.recipientId || !enquiryData.senderName || !enquiryData.propertyId) {
      return EnquiryNextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    await addDoc(collection(enquiryDb, "notifications"), {
      ...enquiryData,
      read: false,
      createdAt: new Date().toISOString(),
    });
    return EnquiryNextResponse.json({ message: "Enquiry sent successfully" }, { status: 201 });
  } catch (err) {
    const error = err as Error;
    console.error("Error sending enquiry: ", error);
    return EnquiryNextResponse.json({ message: "Failed to send enquiry" }, { status: 500 });
  }
}
