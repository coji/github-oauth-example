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
  <Button
    as="a"
    bgColor="white"
    colorScheme="gray"
    href="/api/auth/login/slack"
    leftIcon={<AiOutlineSlack />}
    variant="outline"
    {...rest}
  >
    {children ?? 'Slack'}
  </Button>
)
