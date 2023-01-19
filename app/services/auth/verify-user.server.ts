import { addUser, findUserByEmail, updateUser } from '~/models/user.server'
import invariant from 'tiny-invariant'
import type { StrategyVerifyCallback } from 'remix-auth'
import type {
  SupportedSocialProviderProfile,
  SupportedSocialProviderExtraParams,
} from './supported-social-provider.server'
import type { OAuth2StrategyVerifyParams } from 'remix-auth-oauth2'
import type { SessionUser } from '../auth.server'
import {
  isSupportedSocialProvider,
  type SupportedSocialProvider,
} from './supported-social-provider.server'

/**
 * プロバイダをマージする
 * @param providers
 * @param provider
 * @returns
 */
const mergeProviders = (
  providers: SupportedSocialProvider[],
  provider: SupportedSocialProvider,
) => {
  if (providers.includes(provider)) {
    return providers
  }
  return [...providers, provider]
}

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

  const userProps = {
    ...user,
    providers:
      user && user.providers
        ? mergeProviders(user.providers, profile.provider)
        : [profile.provider],
    [`${profile.provider}UserId`]: profile.id,
    displayName: profile.displayName,
    email: profile.emails?.[0].value,
    photoURL: profile.photos?.[0].value,
  }

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
