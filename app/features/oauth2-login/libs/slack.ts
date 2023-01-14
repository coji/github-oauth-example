import invariant from 'tiny-invariant'
import jwt_decode from 'jwt-decode'

invariant(process.env.SLACK_CLIENT_ID, 'SLACK_CLIENT_ID must be set')
invariant(process.env.SLACK_CLIENT_SECRET, 'SLACK_CLIENT_SECRET must be set')
const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET

interface SlackAccessToken {
  ok: boolean
  access_token: string
  token_type: 'Bearer'
  id_token: string
  state: string
  refresh_token: string
  expires_in: number
}

const REDIRECT_URI = '/api/auth/callback/slack'
/**
 * Slack 認証画面への URL を生成する
 */
export const generateAuthUrl = (request: Request) => {
  const params = new URLSearchParams({
    client_id: SLACK_CLIENT_ID,
    response_type: 'code',
    // access_type: 'offline', TODO: refresh_token を取得する場合は必要のはずだけど取れない
    scope: 'openid email profile',
    include_granted_scopes: 'true',
    redirect_uri: new URL(REDIRECT_URI, request.url).toString(),
    nonce: '1',
    state: 'state1',
  })
  return `https://slack.com/openid/connect/authorize?${params.toString()}`
}

export const fetchAccessToken = async (request: Request) => {
  const code = new URL(request.url).searchParams.get('code')
  invariant(code, 'No code found in the URL.')

  const params = new URLSearchParams({
    code,
    client_id: SLACK_CLIENT_ID,
    client_secret: SLACK_CLIENT_SECRET,
    redirect_uri: new URL(REDIRECT_URI, request.url).toString(),
    grand_type: 'authorization_code',
  })
  const ret = await fetch(
    `https://slack.com/api/openid.connect.token?${params.toString()}`,
  )
  invariant(ret.ok, 'Failed to get access token from Slack.')

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const tokens: SlackAccessToken | null = await ret.json()
  invariant(tokens, 'Failed to get access token from Slack.')

  return tokens
}

export const fetchUser = (idToken: string): Record<string, string> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = jwt_decode(idToken)
  return payload
}
