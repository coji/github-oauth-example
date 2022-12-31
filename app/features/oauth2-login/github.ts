import invariant from 'tiny-invariant'

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

export const fetchAccessToken = async (code: string) => {
  const params = new URLSearchParams({
    code,
    client_id: process.env.GITHUB_CLIENT_ID ?? '',
    client_secret: process.env.GITHUB_CLIENT_SECRET ?? '',
  })
  const ret = await fetch(
    `https://github.com/login/oauth/access_token?${params.toString()}`,
  )
  invariant(ret.ok, 'Failed to get access token from GitHub.')

  const { access_token } = Object.fromEntries(
    new URLSearchParams(await ret.text()),
  )
  return access_token
}

export const fetchUser = async (accessToken: string): Promise<GitHubUser> => {
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
