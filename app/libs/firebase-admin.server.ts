import * as admin from 'firebase-admin'
import invariant from 'tiny-invariant'

const initialize = () => {
  invariant(
    process.env.FIREBASE_ADMIN_PROJECT_ID,
    'Firebase Admin Project ID is required',
  )
  invariant(
    process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    'Firebase Admin Private Key is required',
  )
  invariant(
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    'Firebase Admin Client Email is required',
  )

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
  app.firestore().settings({ ignoreUndefinedProperties: true })
  return app
}

const app = admin.apps.length ? admin.app() : initialize()
const firestore = app.firestore()
export { app, firestore }
