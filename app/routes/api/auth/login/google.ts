import { redirect } from '@remix-run/node'
import { generateAuthUrl } from '~/features/oauth2-login/libs/google'

export const loader = () => redirect(generateAuthUrl())
