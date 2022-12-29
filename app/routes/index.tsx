import type { LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = async (args: LoaderArgs) => {
  return {
    clientId: process.env.GITHUB_CLIENT_ID,
  }
}

export default function Index() {
  const { clientId } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>cojis GitHub Oauth example</h1>
      <div>
        <button>
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${clientId}`}
          >
            Login with GitHub
          </a>
        </button>
      </div>
    </div>
  )
}
