import { firestore } from '~/libs/firebase-admin.server'
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore'

export interface User {
  id: string
  provider: string
  providerUserId: string
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
      provider: data.provider as string,
      providerUserId: data.providerUserId as string,
      displayName: data.name as string,
      email: data.email as string,
      teamId: data.teamId as string,
    }
  },
}

export const findUserByProviderUserId = async (
  provider: string,
  providerUserId: string,
) => {
  const users = await firestore
    .collection('users')
    .withConverter(converter)
    .where('provider', '==', provider)
    .where('providerUserId', '==', providerUserId)
    .limit(1)
    .get()

  if (users.size === 0) {
    return null
  }
  return users.docs[0].data()
}

export const addUser = async (data: Omit<User, 'id'>) => {
  const docRef = await firestore
    .collection('users')
    .withConverter(converter)
    .add({ id: '', ...data })
  return (await docRef.get()).data() ?? null
}

export const getUser = async (id: string) => {
  const user = await firestore.doc(`users/${id}`).withConverter(converter).get()
  return user.data() ?? null
}

export const updateUser = async (user: User) => {
  await firestore
    .doc(`users/${user.id}`)
    .withConverter(converter)
    .set(user, { merge: true })
}

export const deleteUser = async (user: User) => {
  await firestore.doc(`users/${user.id})`).delete()
}
