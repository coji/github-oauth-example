import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type { MetaFunction } from '@remix-run/node' // Depends on the runtime you choose
import { ChakraProvider } from '@chakra-ui/react'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix OAuth Example',
  viewport: 'width=device-width,initial-scale=1',
})

interface DocumentProps {
  children: React.ReactNode
}

const Document = ({ children }: DocumentProps) => {
  return (
    <html lang="ja">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <ChakraProvider>
        <Outlet />
      </ChakraProvider>
    </Document>
  )
}
