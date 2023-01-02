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
  <Button
    as="a"
    colorScheme="gray"
    href="/api/auth/login/github"
    leftIcon={<AiOutlineGithub />}
    variant="outline"
    {...rest}
  >
    {children ?? 'GitHubアカウントで続ける'}
  </Button>
)
