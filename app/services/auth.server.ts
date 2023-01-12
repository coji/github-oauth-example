import { createCookieSessionStorage } from '@remix-run/node'
import { Authenticator, type StrategyVerifyCallback } from 'remix-auth'
import type { OAuth2StrategyVerifyParams } from 'remix-auth-oauth2'
import {
  GitHubStrategy,
  type GitHubProfile,
  type GitHubExtraParams,
} from 'remix-auth-github'
import {
  SlackStrategy,
  type SlackExtraParams,
  type SlackProfile,
} from './SlackStrategy.server'
import invariant from 'tiny-invariant'
import { addUser, findUserByProviderUserId } from '~/models/user.server'

invariant(process.env.BASE_URL, 'BASE_URL is required')
invariant(process.env.SESSION_SECRET, 'SESSION_SECRET is required')
invariant(process.env.GITHUB_CLIENT_ID, 'GITHUB_CLIENT_ID is required')
invariant(process.env.GITHUB_CLIENT_SECRET, 'GITHUB_CLIENT_SECRET is required')
invariant(process.env.SLACK_CLIENT_ID, 'SLACK_CLIENT_ID is required')
invariant(process.env.SLACK_CLIENT_SECRET, 'SLACK_CLIENT_SECRET is required')

export interface SessionUser {
  userId: string
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const auth = new Authenticator<SessionUser>(sessionStorage)

const githubVerify: StrategyVerifyCallback<
  SessionUser,
  OAuth2StrategyVerifyParams<GitHubProfile, GitHubExtraParams>
> = async ({ profile }) => {
  let user = await findUserByProviderUserId('github', profile.id)
  if (!user) {
    // 新規ユーザ
    user = await addUser({
      provider: 'github',
      providerUserId: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.[0].value,
      photoURL: profile.photos?.[0].value,
      teamId: '',
    })
  }
  if (!user) {
    throw new Error('User not found')
  }
  return { userId: user.id }
}

auth.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: new URL(
        '/auth/github/callback',
        process.env.BASE_URL,
      ).toString(),
    },
    githubVerify,
  ),
)

const slackVerify: StrategyVerifyCallback<
  SessionUser,
  OAuth2StrategyVerifyParams<SlackProfile, SlackExtraParams>
> = async ({ profile, accessToken, extraParams }) => {
  let user = await findUserByProviderUserId('slack', profile.id)
  if (!user) {
    // 新規ユーザ
    user = await addUser({
      provider: 'slack',
      providerUserId: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.[0].value,
      photoURL: profile.photos?.[0].value,
      teamId: profile.team.id,
    })
  }
  if (!user) {
    throw new Error('User not found')
  }
  return { userId: user.id }
}

auth.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      callbackURL: new URL(
        '/auth/slack/callback',
        process.env.BASE_URL,
      ).toString(),
    },
    slackVerify,
  ),
)
