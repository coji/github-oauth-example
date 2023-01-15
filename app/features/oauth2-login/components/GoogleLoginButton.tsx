import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { AiOutlineGoogle } from 'react-icons/ai'
import { Form } from '@remix-run/react'
import { useNavigation } from '@remix-run/react'

interface GoogleLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const GoogleLoginButton = ({
  children,
  ...rest
}: GoogleLoginButtonProps) => {
  const navigation = useNavigation()

  return (
    <Form method="get" action="/auth/google">
      <Button
        bgColor="white"
        colorScheme="gray"
        isDisabled={
          navigation.state !== 'idle' &&
          navigation.formAction !== '/auth/google'
        }
        isLoading={
          navigation.state !== 'idle' &&
          navigation.formAction === '/auth/google'
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
