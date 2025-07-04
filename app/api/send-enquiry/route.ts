import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const enquiryData = await request.json();
    if (!enquiryData.recipientId || !enquiryData.senderName || !enquiryData.propertyId) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    await addDoc(collection(db, "notifications"), {
      ...enquiryData,
      read: false,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ message: "Enquiry sent successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to send enquiry" }, { status: 500 });
  }
}
