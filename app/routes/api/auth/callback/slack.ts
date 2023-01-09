import type { LoaderArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { fetchAccessToken, fetchUser } from '~/features/oauth2-login/libs/slack'

export const loader = async ({ request }: LoaderArgs) => {
  const code = new URL(request.url).searchParams.get('code')
  invariant(code, 'No code found in the URL.')

  const token = await fetchAccessToken(code)
  invariant(token, 'No id token found in the response.')

  const user = fetchUser(token.id_token)
  invariant(user, 'No user found in the response.')

  return {
    token,
    user,
  }
}
