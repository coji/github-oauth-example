import type { LoaderArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import {
  fetchAccessToken,
  fetchUser,
} from '~/features/oauth2-login/libs/google'

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
