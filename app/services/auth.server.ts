import { createCookieSessionStorage } from '@remix-run/node'
import { Authenticator, type StrategyVerifyCallback } from 'remix-auth'
import type { OAuth2StrategyVerifyParams } from 'remix-auth-oauth2'
// import {
//   GitHubStrategy,
//   type GitHubProfile,
//   type GitHubExtraParams,
// } from 'remix-auth-github'
import {
  SlackStrategy,
  type SlackExtraParams,
  type SlackProfile,
} from '../features/oauth2-login/libs/SlackStrategy.server'
import invariant from 'tiny-invariant'
import { getUser, addUser, type User } from '~/models/user.server'

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

/*
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
    // eslint-disable-next-line @typescript-eslint/require-await
    async ({ profile, accessToken, extraParams }) => {

    },
  ),
) */

const slackVerify: StrategyVerifyCallback<
  SessionUser,
  OAuth2StrategyVerifyParams<SlackProfile, SlackExtraParams>
> = async ({ profile, accessToken, extraParams }) => {
  let user = await getUser(profile.id)
  if (!user) {
    user = await addUser({
      id: profile.id,
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
