import admin from 'firebase-admin';

// Check if the app is already initialized
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
