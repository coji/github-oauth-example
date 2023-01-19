import type { LoaderArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import {
  fetchAccessToken,
  fetchUser,
} from '~/features/oauth2-login/libs/github'

export const loader = async ({ request }: LoaderArgs) => {
  const accessToken = await fetchAccessToken(request)
  invariant(accessToken, 'No access token found in the response.')

  const user = await fetchUser(accessToken)
  invariant(user, 'No user found in the response.')

  return {
    accessToken,
    user,
  }
}
