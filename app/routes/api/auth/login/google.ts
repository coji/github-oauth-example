import { createHash } from 'crypto'
import { redirect } from '@remix-run/node'

function base64UrlEncode(str: string) {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export const loader = () => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    response_type: 'code',
    scope: 'openid email profile',
    redirect_uri: `${process.env.BASE_URL ?? ''}/api/auth/callback/google`,
    nonce: '1',
    state: 'state1',
    code_challenge: base64UrlEncode(
      createHash('sha256').update('verifier-text-is-here!').digest('base64'),
    ),
    code_challenge_method: 'S256',
  })

  return redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  )
}
