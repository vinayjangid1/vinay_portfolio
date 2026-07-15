import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function submitContactMessage({ name, email, message }) {
  await addDoc(collection(db, 'contactMessages'), {
    name,
    email,
    message,
    createdAt: serverTimestamp(),
  })
}
