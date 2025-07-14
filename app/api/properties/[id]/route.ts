import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

// Handles fetching a single property by its ID. This is a public action.
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: "Property ID is required." }, { status: 400 });
  }
  try {
    const docRef = adminDb.collection("properties").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json({ message: "Failed to fetch property" }, { status: 500 });
  }
}

// Handles updating a single property by its ID. This is a secure action.
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

    const { id } = params;
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

// Handles deleting a single property by its ID. This is a secure action.
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

    const { id } = params;
    const docRef = adminDb.collection("properties").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    // Allow deletion if the user is the owner OR if the user is an admin
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
