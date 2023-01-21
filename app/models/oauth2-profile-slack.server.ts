import { firestore } from '~/libs/firebase-admin.server'
import type {
  SlackProfile,
  SlackExtraParams,
} from '~/libs/SlackStrategy.server'

export const upsertOAuth2ProfileSlack = async ({
  profile,
  accessToken,
  refreshToken,
  extraParams,
}: {
  profile: SlackProfile
  accessToken: string
  refreshToken: string
  extraParams: SlackExtraParams
}) => {
  await firestore.doc(`oauth2-profile-slack/${profile.id}`).set({
    ...profile,
    accessToken,
    refreshToken,
    ...extraParams,
  })
}
