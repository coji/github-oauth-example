import { type LoaderArgs } from '@remix-run/node'
import { createUserSession } from '~/services/session.server'

export const loader = async ({ request }: LoaderArgs) => {
  return createUserSession({
    request,
    userId: '1',
    remember: true,
    redirectTo: '/',
  })
}
