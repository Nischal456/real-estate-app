import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decodedToken = await adminAuth.verifyIdToken(token);
    const callerUid = decodedToken.uid;

    // Verify caller has permissions (is Owner, or has the master admin email)
    const callerDoc = await adminDb.collection("users").doc(callerUid).get();
    const callerData = callerDoc.data();
    const isMasterAdmin = decodedToken.email === 'ebazarsecurities@gmail.com';
    const isOwner = callerData?.role === 'Owner';

    if (!isMasterAdmin && !isOwner) {
      return NextResponse.json({ message: 'Forbidden: Only administrators or owners can change user roles.' }, { status: 403 });
    }

    const { uid, role } = await request.json();
    if (!uid || !role) {
      return NextResponse.json({ message: 'Missing target user ID (uid) or role.' }, { status: 400 });
    }

    if (!['Owner', 'Agent', 'User'].includes(role)) {
      return NextResponse.json({ message: 'Invalid role selection.' }, { status: 400 });
    }

    await adminDb.collection("users").doc(uid).update({ role });
    
    return NextResponse.json({ message: `User role updated to ${role} successfully.` }, { status: 200 });
  } catch (error) {
    console.error("Error in update-role API:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
