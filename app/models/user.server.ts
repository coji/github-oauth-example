import { firestore } from '~/libs/firebase-admin.server'
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore'
import type { SupportedSocialProvider } from '~/services/auth/supported-social-provider.server'
import dayjs from 'dayjs'

export interface User {
  id: string
  providers: SupportedSocialProvider[]
  slackUserId?: string
  githubUserId?: string
  googleUserId?: string
  displayName?: string
  email?: string
  photoURL?: string
  teamId?: string
  updatedAt: string
  createdAt: string
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
      providers: data.providers as SupportedSocialProvider[],
      slackUserId: data.slackUserId ? String(data.slackUserId) : undefined,
      githubUserId: data.githubUserId ? String(data.githubUserId) : undefined,
      googleUserId: data.googleUserId ? String(data.googleUserId) : undefined,
      displayName: data.name ? String(data.name) : undefined,
      email: data.email ? String(data.email) : undefined,
      photoURL: data.photoURL ? String(data.photoURL) : undefined,
      teamId: data.teamId ? String(data.teamId) : undefined,
      updatedAt: String(data.updatedAt),
      createdAt: String(data.createdAt),
    }
  },
}

export const findUserByProviderUserId = async (
  provider: SupportedSocialProvider,
  providerUserId: string,
) => {
  const users = await firestore
    .collection('users')
    .withConverter(converter)
    .where(`${provider}UserId`, '==', providerUserId)
    .limit(1)
    .get()

  if (users.size === 0) {
    return null
  }
  return users.docs[0].data()
}

export const findUserByEmail = async (email: string) => {
  const users = await firestore
    .collection('users')
    .withConverter(converter)
    .where(`email`, '==', email)
    .limit(1)
    .get()

  if (users.size === 0) {
    return null
  }
  return users.docs[0].data()
}

export const addUser = async (
  data: Omit<User, 'id' | 'updatedAt' | 'createdAt'>,
) => {
  const now = dayjs().toISOString()
  const docRef = await firestore
    .collection('users')
    .withConverter(converter)
    .add({ id: '', ...data, updatedAt: now, createdAt: now })
  return (await docRef.get()).data() ?? null
}

export const getUser = async (id: string) => {
  const user = await firestore.doc(`users/${id}`).withConverter(converter).get()
  return user.data() ?? null
}

export const updateUser = async (
  user: Omit<User, 'updatedAt' | 'createdAt'>,
) => {
  const now = dayjs().toISOString()
  await firestore
    .doc(`users/${user.id}`)
    .withConverter(converter)
    .set({ ...user, updatedAt: now }, { merge: true })
}

export const deleteUser = async (user: User) => {
  await firestore.doc(`users/${user.id})`).delete()
}
