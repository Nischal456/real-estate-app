import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function GET(
  request: Request, 
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    if (!id) {
      return NextResponse.json({ message: "Property ID is required." }, { status: 400 });
    }
    const docRef = doc(db, "properties", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }
    const property = { id: docSnap.id, ...docSnap.data() };
    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PUT(
  request: Request, 
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const propertyData = await request.json();
    const docRef = doc(db, "properties", id);
    await updateDoc(docRef, propertyData);
    return NextResponse.json({ message: "Property updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, 
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const docRef = doc(db, "properties", id);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Property deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete property" }, { status: 500 });
  }
}
