import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { Box, Button } from '@chakra-ui/react'

import { auth } from '~/auth.server'

export const action = async ({ request }: ActionArgs) =>
  await auth.logout(request, { redirectTo: '/' })

export const loader = async ({ request }: LoaderArgs) => {
  const { profile, extraParams } = await auth.isAuthenticated(request, {
    failureRedirect: '/',
  })
  return json({ profile, extraParams })
}

export default function Private() {
  const { profile } = useLoaderData<typeof loader>()
  return (
    <Box>
      <Box>{profile.displayName}</Box>
      <Form method="post">
        <Button type="submit">LogOut</Button>
      </Form>
    </Box>
  )
}
