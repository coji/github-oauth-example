import type { LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Grid, Container, Heading, Box, Button } from '@chakra-ui/react'

export const loader = (args: LoaderArgs) => ({
  clientId: process.env.GITHUB_CLIENT_ID ?? '',
})

export default function Index() {
  const { clientId } = useLoaderData<typeof loader>()

  return (
    <Grid height="100vh" templateRows="auto 1fr auto" p="0">
      <Heading>coji&rsquo;s GitHub OAuth example</Heading>
      <Container>
        <div>
          <Button
            colorScheme="blue"
            as="a"
            href={`https://github.com/login/oauth/authorize?client_id=${clientId}`}
          >
            Login with GitHub
          </Button>
        </div>
      </Container>
      <Box as="footer">copyright &copy; 2021 coji.</Box>
    </Grid>
  )
}
