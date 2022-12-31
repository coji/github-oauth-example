import type { LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Grid, Container, Heading, Box, Button } from '@chakra-ui/react'

export const loader = (args: LoaderArgs) => ({
  clientId: process.env.GITHUB_CLIENT_ID ?? '',
})

export default function Index() {
  const { clientId } = useLoaderData<typeof loader>()

  return (
    <Grid templateRows="auto 1fr auto" h="100vh" p="0">
      <Heading>coji&rsquo;s GitHub OAuth example</Heading>
      <Container>
        <div>
          <Button
            as="a"
            colorScheme="blue"
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
