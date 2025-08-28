import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

// =======================================================================
// This is the complete and corrected code for this file.
// The function signatures have been updated to match the exact
// requirements of the latest Next.js versions for deployment.
// =======================================================================

// Handles fetching a single property by its ID.
export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: "Property ID is required." }, { status: 400 });
    }
    const docRef = adminDb.collection("properties").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    const property = { id: docSnap.id, ...docSnap.data() };
    return NextResponse.json(property, { status: 200 });

  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json({ message: "Failed to fetch property" }, { status: 500 });
  }
}

// Handles updating a single property by its ID.
export async function PUT(
  request: Request, 
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
  request: Request, 
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
