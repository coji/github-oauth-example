import type { LoaderArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'

const fetchUser = async (accessToken: string) => {
  const ret = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  })
  console.log(ret)
  invariant(ret.ok, 'Failed to get user from GitHub.')
  return ret.json()
}

export const loader = async ({ request }: LoaderArgs) => {
  const code = new URL(request.url).searchParams.get('code')
  invariant(code, 'No code found in the URL.')

  const ret = await fetch(
    `https://github.com/login/oauth/access_token?code=${code}&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
  )
  invariant(ret.ok, 'Failed to get access token from GitHub.')

  const { access_token } = Object.fromEntries(
    new URLSearchParams(await ret.text()),
  )
  invariant(access_token, 'No access token found in the response.')

  const user = await fetchUser(access_token)

  return {
    code,
    user,
  }
}
