import { GitHubStrategy } from 'remix-auth-github'
import invariant from 'tiny-invariant'
import { verifyUser } from './verify-user.server'

invariant(process.env.GITHUB_CLIENT_ID, 'GITHUB_CLIENT_ID is required')
invariant(process.env.GITHUB_CLIENT_SECRET, 'GITHUB_CLIENT_SECRET is required')

export const strategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL ?? '/'}auth/github/callback`,
  },
  verifyUser,
)
