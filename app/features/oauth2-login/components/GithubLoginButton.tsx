import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

interface GithubLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const GithubLoginButton = ({
  children,
  ...rest
}: GithubLoginButtonProps) => (
  <Button as="a" colorScheme="blue" href="/api/auth/login/github" {...rest}>
    {children ?? 'Login with GitHub'}
  </Button>
)
