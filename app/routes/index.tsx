import {
  Grid,
  Heading,
  Box,
  VStack,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react'
import { GithubLoginButton } from '~/features/oauth2-login/components/GithubLoginButton'
import { GoogleLoginButton } from '~/features/oauth2-login/components/GoogleLoginButton'

export default function Index() {
  return (
    <Grid
      alignItems="center"
      justifyItems="center"
      templateRows="1fr auto"
      h="100vh"
      p="0"
      bgColor="gray.50"
    >
      <VStack gap="4" w="full" maxW="sm">
        <Heading p="2" size="md">
          coji&rsquo;s GitHub OAuth example
        </Heading>
        <VStack gap="4" w="full">
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input bgColor="white" id="email" name="email" type="email"></Input>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              bgColor="white"
              id="password"
              name="password"
              type="password"
            />
          </FormControl>

          <Button w="full" bgColor="gray.700" colorScheme="blackAlpha">
            サインイン
          </Button>
        </VStack>

        <Box pos="relative" w="full">
          <Flex pos="absolute" align="center" inset="0">
            <Box
              w="full"
              borderWidth="100%"
              borderTop="1px"
              borderTopColor="gray.200"
            />
          </Flex>
          <Flex pos="relative" justify="center">
            <Box display="inline-block" px="2" bgColor="gray.50">
              Or continue with
            </Box>
          </Flex>
        </Box>

        <Grid gap="4" templateColumns="1fr 1fr" w="full">
          <GithubLoginButton />
          <GoogleLoginButton />
        </Grid>
      </VStack>

      <Box as="footer">copyright &copy; 2021 coji.</Box>
    </Grid>
  )
}
