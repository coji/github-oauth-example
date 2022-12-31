import type { LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Grid, Container, Heading, Box, HStack, Button } from '@chakra-ui/react'

export const loader = (args: LoaderArgs) => ({
  clientId: process.env.GITHUB_CLIENT_ID ?? '',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
})

export default function Index() {
  const { clientId, googleClientId } = useLoaderData<typeof loader>()

  return (
    <Grid templateRows="auto 1fr auto" h="100vh" p="0">
      <Heading>coji&rsquo;s GitHub OAuth example</Heading>
      <Container>
        <HStack>
          <Button
            as="a"
            colorScheme="blue"
            href={`https://github.com/login/oauth/authorize?client_id=${clientId}`}
          >
            Login with GitHub
          </Button>
          <Button
            as="a"
            colorScheme="blue"
            href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&response_type=code&scope=openid email profile&redirect_uri=http://localhost:3000/api/auth/google_callback&nonce=1&state=state1`}
          >
            Login with Google
          </Button>
        </HStack>
      </Container>
      <Box as="footer">copyright &copy; 2021 coji.</Box>
    </Grid>
  )
}
