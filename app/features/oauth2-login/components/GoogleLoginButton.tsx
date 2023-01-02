import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

interface GoogleLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const GoogleLoginButton = ({
  children,
  ...rest
}: GoogleLoginButtonProps) => {
  return (
    <Button as="a" colorScheme="blue" href="/api/auth/login/google" {...rest}>
      {children ?? 'Login with Google'}
    </Button>
  )
}
