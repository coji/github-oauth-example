import { Form } from '@remix-run/react'
import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { AiOutlineGithub } from 'react-icons/ai'
import { useTransition } from '@remix-run/react'

interface GithubLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const GithubLoginButton = ({
  children,
  ...rest
}: GithubLoginButtonProps) => {
  const transition = useTransition()

  return (
    <Form method="get" action="/auth/github">
      <Button
        bgColor="white"
        colorScheme="gray"
        isDisabled={
          transition.state !== 'idle' &&
          transition.submission?.action !== '/auth/github'
        }
        isLoading={
          transition.state !== 'idle' &&
          transition.submission?.action === '/auth/github'
        }
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
