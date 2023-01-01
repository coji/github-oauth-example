import type { EntryContext } from '@remix-run/node'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'

import { ServerStyleContext } from './utils/context'
import createEmotionCache from './utils/createEmotionCache'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const cache = createEmotionCache()
  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />,
      </CacheProvider>
    </ServerStyleContext.Provider>,
  )
  const emotionServer = createEmotionServer(cache)
  const chunks = emotionServer.extractCriticalToChunks(html)
  const markup = renderToString(
    <ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>,
  )

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    headers: responseHeaders,
    status: responseStatusCode,
  })
}
