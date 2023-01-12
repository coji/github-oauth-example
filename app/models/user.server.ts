import { firestore } from '~/libs/firebase-admin.server'
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore'

export interface User {
  id: string
  displayName?: string
  email?: string
  photoURL?: string
  teamId: string
}

const converter: FirestoreDataConverter<User> = {
  toFirestore(user: User) {
    const { id, ...rest } = user
    return {
      ...rest,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): User {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      displayName: data.name as string,
      email: data.email as string,
      teamId: data.teamId as string,
    }
  },
}

export const addUser = async (data: User) => {
  const docRef = await firestore
    .collection('users')
    .withConverter(converter)
    .add({ ...data })
  return (await docRef.get()).data()
}

export const getUser = async (id: string) => {
  const user = await firestore.doc(`users/${id}`).withConverter(converter).get()
  return user.data()
}

export const updateUser = async (user: User) =>
  await firestore
    .doc(`users/${user.id}`)
    .withConverter(converter)
    .set(user, { merge: true })

export const deleteUser = async (user: User) =>
  await firestore.doc(`users/${user.id})`).delete()
