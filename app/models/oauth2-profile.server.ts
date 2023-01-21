import { firestore } from '~/libs/firebase-admin.server'
import type {
  SupportedSocialProviderProfile,
  SupportedSocialProviderExtraParams,
} from '~/services/auth/supported-social-provider.server'

export const upsertOAuth2Profile = async ({
  profile,
  accessToken,
  refreshToken,
  extraParams,
}: {
  profile: SupportedSocialProviderProfile
  accessToken: string
  refreshToken: string
  extraParams: SupportedSocialProviderExtraParams
}) => {
  await firestore.doc(`oauth2-${profile.provider}/${profile.id}`).set({
    profile,
    accessToken,
    refreshToken,
    extraParams,
  })
}
