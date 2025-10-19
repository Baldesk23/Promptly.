// Firebase admin initialization (used in server-side API routes)
// Requires service account JSON configured in environment variable FIREBASE_SERVICE_ACCOUNT
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!svc) {
    console.error('Missing FIREBASE_SERVICE_ACCOUNT env var');
  } else {
    const creds = JSON.parse(svc);
    admin.initializeApp({
      credential: admin.credential.cert(creds),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }
}

export default admin;
