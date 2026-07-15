import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCUKTO0GwomXXcg1wB-FTRmZm_eoo5CKLc',
  authDomain: 'vinay-portfolio-prod.firebaseapp.com',
  projectId: 'vinay-portfolio-prod',
  storageBucket: 'vinay-portfolio-prod.firebasestorage.app',
  messagingSenderId: '368491936576',
  appId: '1:368491936576:web:6a2206cddb3c02acb9d8a5',
  measurementId: 'G-9FRFRP23F0',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

/** Browser-only Analytics init (safe for Vite / SSR guards). */
export async function initAnalytics() {
  if (typeof window === 'undefined') return null
  if (!(await isSupported())) return null
  return getAnalytics(app)
}
