import { Grid, Container, Heading, Box, HStack } from '@chakra-ui/react'
import { GithubLoginButton } from '~/features/oauth2-login/components/GithubLoginButton'
import { GoogleLoginButton } from '~/features/oauth2-login/components/GoogleLoginButton'

export default function Index() {
  return (
    <Grid templateRows="auto 1fr auto" h="100vh" p="0">
      <Heading>coji&rsquo;s GitHub OAuth example</Heading>
      <Container>
        <HStack>
          <GithubLoginButton />
          <GoogleLoginButton />
        </HStack>
      </Container>
      <Box as="footer">copyright &copy; 2021 coji.</Box>
    </Grid>
  )
}
