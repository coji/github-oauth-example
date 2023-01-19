import type { GitHubProfile, GitHubExtraParams } from 'remix-auth-github'
import type { GoogleProfile, GoogleExtraParams } from 'remix-auth-google'
import type {
  SlackProfile,
  SlackExtraParams,
} from '~/libs/SlackStrategy.server'

const SocialProvider = {
  SLACK: 'slack',
  GITHUB: 'github',
  GOOGLE: 'google',
} as const

export type SupportedSocialProvider = 'slack' | 'github' | 'google'

const supportedSocialProviders = [
  SocialProvider.SLACK,
  SocialProvider.GITHUB,
  SocialProvider.GOOGLE,
] as const

export const isSupportedSocialProvider = (
  provider: unknown,
): provider is SupportedSocialProvider =>
  typeof provider === 'string' &&
  supportedSocialProviders.includes(provider as SupportedSocialProvider)

export type SupportedSocialProviderProfile =
  | GitHubProfile
  | GoogleProfile
  | SlackProfile

export type SupportedSocialProviderExtraParams =
  | GitHubExtraParams
  | GoogleExtraParams
  | SlackExtraParams
