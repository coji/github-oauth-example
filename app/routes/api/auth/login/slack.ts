import { redirect } from '@remix-run/node'
import { generateAuthUrl } from '~/features/oauth2-login/libs/slack'

export const loader = () => {
  return redirect(`${generateAuthUrl()}`)
}
