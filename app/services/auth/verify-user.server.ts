import { addUser, findUserByEmail, updateUser } from '~/models/user.server'
import invariant from 'tiny-invariant'
import type { StrategyVerifyCallback } from 'remix-auth'
import type {
  SupportedSocialProviderProfile,
  SupportedSocialProviderExtraParams,
} from './supported-social-provider.server'
import type { OAuth2StrategyVerifyParams } from 'remix-auth-oauth2'
import type { SessionUser } from '../auth.server'
import { isSupportedSocialProvider } from './supported-social-provider.server'
import { buildUserProps } from '~/models/user.server'

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

  let user = await findUserByEmail(profile.emails?.[0].value)
  const userProps = buildUserProps(user, profile)
  if (!user) {
    // 新規ユーザ
    user = await addUser(userProps)
  } else {
    await updateUser({
      id: user.id,
      ...userProps,
    })
  }
  if (!user) {
    throw new Error('User not found')
  }

  return { userId: user.id }
}
