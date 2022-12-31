import type { LoaderArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'

const fetchAccessToken = async (code: string) => {
  const ret = await fetch(
    `https://github.com/login/oauth/access_token?code=${code}&client_id=${
      process.env.GITHUB_CLIENT_ID ?? ''
    }&client_secret=${process.env.GITHUB_CLIENT_SECRET ?? ''}`,
  )
  if (!ret.ok) {
    return null
  }

  const { access_token } = Object.fromEntries(
    new URLSearchParams(await ret.text()),
  )
  return access_token
}

interface GitHubUser {
  login: string
  id: number
  node_id: string
  avatar_url: string
  html_url: string
  name: string
  email: string
}

const isGitHubUser = (user: unknown): user is GitHubUser => {
  return typeof user === 'object' && user !== null && 'login' in user
}

const fetchUser = async (accessToken: string): Promise<GitHubUser> => {
  const ret = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  })
  invariant(ret.ok, 'Failed to get user from GitHub.')
  const user: unknown = await ret.json()
  invariant(isGitHubUser(user))

  return user
}

export const loader = async ({ request }: LoaderArgs) => {
  const code = new URL(request.url).searchParams.get('code')
  invariant(code, 'No code found in the URL.')

  const accessToken = await fetchAccessToken(code)
  invariant(accessToken, 'No access token found in the response.')

  const user = await fetchUser(accessToken)
  invariant(user, 'No user found in the response.')

  return {
    code,
    accessToken,
    user,
  }
}
