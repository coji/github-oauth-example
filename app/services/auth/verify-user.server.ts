import { addUser, findUserByEmail } from '~/models/user.server'
import invariant from 'tiny-invariant'
import type { StrategyVerifyCallback } from 'remix-auth'
import {
  type SupportedSocialProviderProfile,
  type SupportedSocialProviderExtraParams,
} from './supported-social-provider.server'
import type { OAuth2StrategyVerifyParams } from 'remix-auth-oauth2'
import type { SessionUser } from '../auth.server'
import { isSupportedSocialProvider } from './supported-social-provider.server'
import { buildUserProps } from '~/models/user.server'
import { upsertOAuth2Profile } from '~/models/oauth2-profile.server'

export const verifyUser: StrategyVerifyCallback<
  SessionUser,
  OAuth2StrategyVerifyParams<
    SupportedSocialProviderProfile,
    SupportedSocialProviderExtraParams
  >
> = async ({ profile, accessToken, refreshToken, extraParams, context }) => {
  invariant(
    isSupportedSocialProvider(profile.provider),
    'provider not supported',
  )
  invariant(profile.id, 'profile.id is required')
  invariant(profile.emails?.[0].value, 'profile.email is required')

  await upsertOAuth2Profile({ profile, accessToken, refreshToken, extraParams })
  let user = await findUserByEmail(profile.emails?.[0].value)
  if (!user) {
    // 新規ユーザ
    const userProps = buildUserProps(user, profile)
    user = await addUser(userProps)
    if (!user) {
      throw new Error('User not found')
    }
  }

  return { userId: user.id }
}
