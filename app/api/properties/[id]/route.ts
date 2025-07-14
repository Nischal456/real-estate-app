import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function GET(
  request: Request,
  context: { params: Record<string, string | string[]> }
) {
  const idParam = context.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

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

export async function PUT(
  request: Request,
  context: { params: Record<string, string | string[]> }
) {
  const idParam = context.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    return NextResponse.json({ message: "Property ID is required." }, { status: 400 });
  }

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

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

export async function DELETE(
  request: Request,
  context: { params: Record<string, string | string[]> }
) {
  const idParam = context.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    return NextResponse.json({ message: "Property ID is required." }, { status: 400 });
  }

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;

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
