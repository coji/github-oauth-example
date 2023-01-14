import invariant from 'tiny-invariant'

invariant(process.env.GITHUB_CLIENT_ID, 'GITHUB_CLIENT_ID must be set')
invariant(process.env.GITHUB_CLIENT_SECRET, 'GITHUB_CLIENT_SECRET must be set')
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

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

/**
 * Google 認証画面への URL を生成する
 */
export const generateAuthUrl = (request: Request) => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
  })
  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export const fetchAccessToken = async (request: Request) => {
  const code = new URL(request.url).searchParams.get('code')
  invariant(code, 'No code found in the URL.')

  const params = new URLSearchParams({
    code,
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
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
  invariant(isGitHubUser(user), 'invalid github user')

  return user
}
