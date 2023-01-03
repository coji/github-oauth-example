import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { AiOutlineGoogle } from 'react-icons/ai'

interface GoogleLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const GoogleLoginButton = ({
  children,
  ...rest
}: GoogleLoginButtonProps) => {
  return (
    <Button
      as="a"
      bgColor="white"
      colorScheme="gray"
      href="/api/auth/login/google"
      leftIcon={<AiOutlineGoogle />}
      variant="outline"
      {...rest}
    >
      {children ?? 'Google'}
    </Button>
  )
}
