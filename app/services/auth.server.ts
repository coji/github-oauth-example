import { createCookieSessionStorage } from '@remix-run/node'
import { Authenticator } from 'remix-auth'
import invariant from 'tiny-invariant'
import { strategy as GoogleStrategy } from './auth/google-auth.server'
import { strategy as GitHubStrategy } from './auth/github-auth.server'
import { strategy as SlackStrategy } from './auth/slack-auth.server'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET is required')

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

auth.use(GoogleStrategy)
auth.use(GitHubStrategy)
auth.use(SlackStrategy)
