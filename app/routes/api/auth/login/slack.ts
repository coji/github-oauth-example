import type { LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { generateAuthUrl } from '~/features/oauth2-login/libs/slack'

export const loader = ({ request }: LoaderArgs) => {
  return redirect(`${generateAuthUrl(request)}`)
}
