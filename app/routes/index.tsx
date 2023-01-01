import { useLoaderData } from '@remix-run/react'
import { Grid, Container, Heading, Box, HStack } from '@chakra-ui/react'
import { GithubLoginButton } from '~/features/oauth2-login/components/GithubLoginButton'
import { GoogleLoginButton } from '~/features/oauth2-login/components/GoogleLoginButton'

export const loader = () => ({
  githubClientId: process.env.GITHUB_CLIENT_ID ?? '',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
})

export default function Index() {
  const { githubClientId, googleClientId } = useLoaderData<typeof loader>()

  return (
    <Grid templateRows="auto 1fr auto" h="100vh" p="0">
      <Heading>coji&rsquo;s GitHub OAuth example</Heading>
      <Container>
        <HStack>
          <GithubLoginButton clientId={githubClientId} />
          <GoogleLoginButton clientId={googleClientId} />
        </HStack>
      </Container>
      <Box as="footer">copyright &copy; 2021 coji.</Box>
    </Grid>
  )
}
