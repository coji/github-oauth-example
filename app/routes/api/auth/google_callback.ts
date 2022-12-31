import type { LoaderArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'

const fetchAccessToken = async (code: string) => {
  const params = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    redirect_uri: 'http://localhost:3000/api/auth/google_callback',
  })

  const ret = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: params.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  invariant(ret.ok)

  const { access_token } = (await ret.json()) as unknown as Record<
    string,
    string
  >
  return access_token
}

interface GoogleUser {
  id: number
  email: string
  verified_email: boolean
  name: string
  picture: string
  hd: string
}

const isGoogleUser = (user: unknown): user is GoogleUser => {
  return typeof user === 'object' && user !== null && 'email' in user
}

const fetchUser = async (accessToken: string): Promise<GoogleUser> => {
  const ret = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  invariant(ret.ok, 'Failed to get user from GitHub.')
  const user: unknown = await ret.json()
  invariant(isGoogleUser(user), 'ret is not google user')

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
