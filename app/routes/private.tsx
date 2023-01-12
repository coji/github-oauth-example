import { Outlet } from '@remix-run/react'
import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { Heading, Grid, Box, Button } from '@chakra-ui/react'

import { auth } from '~/services/auth.server'
import { getUser } from '~/models/user.server'

export const action = async ({ request }: ActionArgs) =>
  await auth.logout(request, { redirectTo: '/' })

export const loader = async ({ request }: LoaderArgs) => {
  const { userId } = await auth.isAuthenticated(request, {
    failureRedirect: '/',
  })
  const user = await getUser(userId)
  return json({ user })
}

export default function Private() {
  const { user } = useLoaderData<typeof loader>()
  return (
    <Grid templateRows="auto 1fr auto" minH="100vh">
      <Heading>
        Remix OAuth Example private page
        <Form method="post">
          <Button type="submit">LogOut</Button>
        </Form>
        <Box>{JSON.stringify(user)}</Box>
      </Heading>
      <Outlet />
      <Box as="footer" p="4" textAlign="center">
        Copyright &copy; {new Date().getFullYear()} coji.
      </Box>
    </Grid>
  )
}
