import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { AiOutlineGoogle } from 'react-icons/ai'
import { Form } from '@remix-run/react'
import { useTransition } from '@remix-run/react'

interface GoogleLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const GoogleLoginButton = ({
  children,
  ...rest
}: GoogleLoginButtonProps) => {
  const transition = useTransition()

  return (
    <Form method="get" action="/auth/google">
      <Button
        bgColor="white"
        colorScheme="gray"
        isDisabled={
          transition.state !== 'idle' &&
          transition.submission?.action !== '/auth/google'
        }
        isLoading={
          transition.state !== 'idle' &&
          transition.submission?.action === '/auth/google'
        }
        leftIcon={<AiOutlineGoogle />}
        type="submit"
        variant="outline"
        {...rest}
      >
        {children ?? 'Google'}
      </Button>
    </Form>
  )
}
