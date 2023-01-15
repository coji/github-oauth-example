import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { Heading, Grid, Box, Button, Card, CardBody } from '@chakra-ui/react'

import { auth } from '~/services/auth.server'
import { getUser } from '~/models/user.server'

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
    <Grid templateRows="auto 1fr auto" h="100dvh" bgColor="gray.100">
      <Heading display="flex" p="4">
        <Box flex="1">Private page</Box>
        <Form method="post" action="/logout">
          <Button colorScheme="blue" type="submit">
            ログアウト
          </Button>
        </Form>
      </Heading>

      <Box p="4">
        <Card color="gray.200" bgColor="black">
          <CardBody>
            <Box overflow="auto" w="full" whiteSpace="pre">
              {JSON.stringify(user, null, 2)}
            </Box>
          </CardBody>
        </Card>
      </Box>

      <Box as="footer" p="2" textAlign="center">
        Copyright &copy; {new Date().getFullYear()} coji.
      </Box>
    </Grid>
  )
}
