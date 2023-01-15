import { Form } from '@remix-run/react'
import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { AiOutlineSlack } from 'react-icons/ai'
import { useTransition } from '@remix-run/react'

interface GithubLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const SlackLoginButton = ({
  children,
  ...rest
}: GithubLoginButtonProps) => {
  const transition = useTransition()

  return (
    <Form action="/auth/slack">
      <Button
        bgColor="white"
        colorScheme="gray"
        isDisabled={
          transition.state !== 'idle' &&
          transition.submission?.action !== '/auth/slack'
        }
        isLoading={
          transition.state !== 'idle' &&
          transition.submission?.action === '/auth/slack'
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
