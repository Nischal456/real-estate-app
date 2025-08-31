import { NextResponse, NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

// Handles updating a single property by its ID.
export async function PUT(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    
    const id = params.id;
    const propertyData = await request.json();
    const docRef = adminDb.collection("properties").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    if (docSnap.data()?.ownerId !== uid) {
        return NextResponse.json({ message: "Forbidden: You do not have permission to edit this property." }, { status: 403 });
    }

    await docRef.update(propertyData);
    return NextResponse.json({ message: "Property updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json({ message: "Failed to update property" }, { status: 500 });
  }
}


// Handles deleting a single property by its ID.
export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;

    const id = params.id;
    const docRef = adminDb.collection("properties").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    if (docSnap.data()?.ownerId !== uid && !isAdmin) {
      return NextResponse.json({ message: "Forbidden: You do not have permission to delete this property." }, { status: 403 });
    }

    await docRef.delete();
    
    return NextResponse.json({ message: "Property deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json({ message: "Failed to delete property" }, { status: 500 });
  }
}
