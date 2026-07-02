import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decodedToken = await adminAuth.verifyIdToken(token);
    const callerUid = decodedToken.uid;

    const callerDoc = await adminDb.collection("users").doc(callerUid).get();
    const callerData = callerDoc.data();
    const isMasterAdmin = decodedToken.email === 'ebazarsecurities@gmail.com';
    const isOwner = callerData?.role === 'Owner';
    const isAgent = callerData?.role === 'Agent';

    if (!isMasterAdmin && !isOwner && !isAgent) {
      return NextResponse.json({ message: 'Forbidden: Access denied.' }, { status: 403 });
    }

    await adminDb.collection("notifications").doc(id).delete();
    return NextResponse.json({ message: 'Enquiry deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Error in delete notification API:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decodedToken = await adminAuth.verifyIdToken(token);
    const callerUid = decodedToken.uid;

    const callerDoc = await adminDb.collection("users").doc(callerUid).get();
    const callerData = callerDoc.data();
    const isMasterAdmin = decodedToken.email === 'ebazarsecurities@gmail.com';
    const isOwner = callerData?.role === 'Owner';
    const isAgent = callerData?.role === 'Agent';

    if (!isMasterAdmin && !isOwner && !isAgent) {
      return NextResponse.json({ message: 'Forbidden: Access denied.' }, { status: 403 });
    }

    const { read } = await request.json();
    await adminDb.collection("notifications").doc(id).update({ read });
    return NextResponse.json({ message: 'Enquiry updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Error in update notification API:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
