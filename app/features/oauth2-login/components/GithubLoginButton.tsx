import { Form } from '@remix-run/react'
import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { AiOutlineGithub } from 'react-icons/ai'
interface GithubLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const GithubLoginButton = ({
  children,
  ...rest
}: GithubLoginButtonProps) => (
  <Form method="get" action="/auth/github">
    <Button
      bgColor="white"
      colorScheme="gray"
      leftIcon={<AiOutlineGithub />}
      type="submit"
      variant="outline"
      {...rest}
    >
      {children ?? 'GitHub'}
    </Button>
  </Form>
)
