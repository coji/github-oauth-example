import invariant from 'tiny-invariant'

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

export const fetchAccessToken = async (code: string) => {
  const ret = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      redirect_uri: 'http://localhost:3000/api/auth/google_callback',
    }).toString(),
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

export const fetchUser = async (accessToken: string): Promise<GoogleUser> => {
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
