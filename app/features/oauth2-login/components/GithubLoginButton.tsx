import { Button } from '@chakra-ui/react'

interface GithubLoginButtonProps {
  clientId: string
  children?: React.ReactNode
}

export const GithubLoginButton = ({
  clientId,
  children,
}: GithubLoginButtonProps) => (
  <Button
    as="a"
    colorScheme="blue"
    href={`https://github.com/login/oauth/authorize?client_id=${clientId}`}
  >
    {children ?? 'Login with GitHub'}
  </Button>
)
