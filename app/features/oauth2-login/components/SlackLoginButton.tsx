import { Form } from '@remix-run/react'
import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { AiOutlineSlack } from 'react-icons/ai'
interface GithubLoginButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export const SlackLoginButton = ({
  children,
  ...rest
}: GithubLoginButtonProps) => (
  <Form action="/auth/slack">
    <Button
      bgColor="white"
      colorScheme="gray"
      leftIcon={<AiOutlineSlack />}
      type="submit"
      variant="outline"
      {...rest}
    >
      {children ?? 'Slack'}
    </Button>
  </Form>
)
