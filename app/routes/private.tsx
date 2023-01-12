import { Outlet } from '@remix-run/react'
import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { Heading, Grid, Box, Button, Avatar } from '@chakra-ui/react'

import { auth } from '~/services/auth.server'

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
    <Grid templateRows="auto 1fr auto" minH="100vh">
      <Heading>
        Remix OAuth Example private page
        <Form method="post">
          <Button type="submit">LogOut</Button>
        </Form>
        <Box>
          <Avatar src={profile.photos?.[0].value} />
          <Box>{profile.displayName}</Box>
          {JSON.stringify(profile)}
        </Box>
      </Heading>
      <Outlet />
      <Box as="footer" p="4" textAlign="center">
        Copyright &copy; {new Date().getFullYear()} coji.
      </Box>
    </Grid>
  )
}
