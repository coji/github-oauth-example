import { Form } from '@remix-run/react'
import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { AiOutlineSlack } from 'react-icons/ai'
import { useNavigation } from '@remix-run/react'

interface GithubLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const SlackLoginButton = ({
  children,
  ...rest
}: GithubLoginButtonProps) => {
  const navigation = useNavigation()

  return (
    <Form action="/auth/slack">
      <Button
        bgColor="white"
        colorScheme="gray"
        isDisabled={
          navigation.state !== 'idle' && navigation.formAction !== '/auth/slack'
        }
        isLoading={
          navigation.state !== 'idle' && navigation.formAction === '/auth/slack'
        }
        leftIcon={<AiOutlineSlack />}
        type="submit"
        variant="outline"
        {...rest}
      >
        {children ?? 'Slack'}
      </Button>
    </Form>
  )
}
