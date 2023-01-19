import { Form } from '@remix-run/react'
import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { AiOutlineGithub } from 'react-icons/ai'
import { useNavigation } from '@remix-run/react'

interface GithubLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const GithubLoginButton = ({
  children,
  ...rest
}: GithubLoginButtonProps) => {
  const navigation = useNavigation()
  const isLoading =
    navigation.state === 'loading' && navigation.formAction === '/auth/github'

  return (
    <Form action="/auth/github">
      <Button
        bgColor="white"
        colorScheme="gray"
        isLoading={isLoading}
        leftIcon={<AiOutlineGithub />}
        type="submit"
        variant="outline"
        {...rest}
      >
        {children ?? 'GitHub'}
      </Button>
    </Form>
  )
}
