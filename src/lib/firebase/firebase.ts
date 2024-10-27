import { initializeApp, cert, ServiceAccount, getApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(JSON.parse(atob(process.env.FIREBASE_SERVICE_ACCOUNT as string))),
    });

export const db = getFirestore();
