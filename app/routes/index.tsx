import {
  Grid,
  Card,
  CardBody,
  Heading,
  Box,
  VStack,
  HStack,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
} from '@chakra-ui/react'
import { SlackLoginButton } from '~/features/oauth2-login/components/SlackLoginButton'
import { GithubLoginButton } from '~/features/oauth2-login/components/GithubLoginButton'
import { GoogleLoginButton } from '~/features/oauth2-login/components/GoogleLoginButton'
import { PasswordField } from '~/components/PasswordField'
export default function Index() {
  return (
    <Grid
      alignItems="center"
      justifyItems="center"
      templateRows="1fr auto"
      h="100vh"
      bgColor="gray.50"
    >
      <VStack>
        <Heading p="4" size="md">
          coji&rsquo;s GitHub OAuth example
        </Heading>

        <Card p="4" borderRadius="xl" bgColor="white">
          <CardBody>
            <VStack gap="6">
              <VStack gap="4" w="full">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    bgColor="white"
                    id="email"
                    name="email"
                    type="email"
                  ></Input>
                </FormControl>

                <PasswordField />

                <HStack justify="space-between">
                  <Checkbox defaultChecked>ログインを記憶</Checkbox>
                  <Button colorScheme="blue" size="sm" variant="link">
                    Forgot password?
                  </Button>
                </HStack>

                <Button w="full" colorScheme="blue">
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
                  <Box display="inline-block" px="2" bgColor="white">
                    Or continue with
                  </Box>
                </Flex>
              </Box>

              <Grid gap="4" templateColumns="1fr 1fr 1fr" w="full">
                <SlackLoginButton />
                <GithubLoginButton />
                <GoogleLoginButton />
              </Grid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      <Box as="footer">copyright &copy; 2021 coji.</Box>
    </Grid>
  )
}
