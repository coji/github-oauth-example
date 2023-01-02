import { redirect } from '@remix-run/node'

export const loader = () => {
  return redirect(
    `https://github.com/login/oauth/authorize?client_id=${
      process.env.GITHUB_CLIENT_ID ?? ''
    }`,
  )
}
