import {
  addUser,
  findUserByProviderUserId,
  updateUser,
} from '~/models/user.server'
import invariant from 'tiny-invariant'
import type { StrategyVerifyCallback } from 'remix-auth'
import type { OAuth2StrategyVerifyParams } from 'remix-auth-oauth2'
import type { GitHubProfile, GitHubExtraParams } from 'remix-auth-github'
import type { GoogleProfile, GoogleExtraParams } from 'remix-auth-google'
import type { SlackProfile, SlackExtraParams } from '../SlackStrategy.server'
import type { SessionUser } from '../auth.server'

export type SupportedSocialProviderProfile =
  | GitHubProfile
  | GoogleProfile
  | SlackProfile

export type SupportedSocialProviderExtraParams =
  | GitHubExtraParams
  | GoogleExtraParams
  | SlackExtraParams

export const verifyUser: StrategyVerifyCallback<
  SessionUser,
  OAuth2StrategyVerifyParams<
    SupportedSocialProviderProfile,
    SupportedSocialProviderExtraParams
  >
> = async ({ profile, accessToken, refreshToken, extraParams, context }) => {
  invariant(profile.id, 'profile.id is required')
  invariant(context, 'context is required')
  invariant(context.provider, 'context.provider is required')
  invariant(typeof context.provider === 'string', 'context.provider is string')

  let user = await findUserByProviderUserId(context.provider, profile.id)
  const userProps = {
    provider: context.provider,
    providerUserId: profile.id,
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