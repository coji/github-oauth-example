import { useState, useEffect } from 'react'
import { Button } from '@chakra-ui/react'

interface GoogleLoginButtonProps {
  clientId: string
  children?: React.ReactNode
}

export const GoogleLoginButton = ({
  clientId,
  children,
}: GoogleLoginButtonProps) => {
  const [params, setParams] = useState<URLSearchParams>()

  useEffect(() => {
    setParams(
      new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        scope: 'openid email profile',
        redirect_uri: `${location.origin}/api/auth/callback/google`,
        nonce: '1',
        state: 'state1',
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Button
      as="a"
      colorScheme="blue"
      href={`https://accounts.google.com/o/oauth2/v2/auth?${
        params ? params.toString() : ''
      }}`}
    >
      {children ?? 'Login with Google'}
    </Button>
  )
}
