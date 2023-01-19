import invariant from 'tiny-invariant'
/**
 * ngrokでローカル環境を公開している場合などで forwarded 系ヘッダに応じた適正なリクエストURLを生成する
 * @param req
 * @returns
 */
export const createForwardedRequest = (req: Request) => {
  const forwardedHost =
    req.headers.get('x-forwarded-host') || req.headers.get('host')
  invariant(forwardedHost, 'x-forwarded-host or host header is required')

  const forwardedProto = req.headers.get('x-forwarded-proto')
  const url = new URL(req.url)

  const request = new Request(
    forwardedProto
      ? `${forwardedProto}://${forwardedHost}${url.pathname}${url.search}`
      : req.url,
    req,
  )
  return request
}
