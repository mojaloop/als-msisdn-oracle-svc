import { Server } from '@hapi/hapi'
import { Logger } from '@mojaloop/sdk-standard-components'

const internalRoutes = ['/metrics', '/health']
const defineSeverity = (route: string): Logger.Level => (internalRoutes.includes(route) ? 'debug' : 'info')

export const loggingPlugin = {
  name: 'loggingPlugin',
  version: '1.0.0',
  once: true,
  register: async (server: Server) => {
    const { logger } = server.app

    server.ext({
      type: 'onRequest',
      method: (request, h) => {
        const { path, method, headers, payload, query } = request
        const { remoteAddress } = request.info
        const requestId = `${request.info.id}__${headers.traceid}`
        request.info.id = requestId

        const severity = defineSeverity(path)
        logger
          .push({ headers, payload, query, requestId, remoteAddress })
          [severity](`[==> req] ${method.toUpperCase()} ${path}`)
        return h.continue
      }
    })

    server.ext({
      type: 'onPreResponse',
      method: (request, h) => {
        const { path, method, response } = request
        const { received } = request.info

        const statusCode = response instanceof Error ? response.output?.statusCode : response.statusCode
        const respTimeSec = ((Date.now() - received) / 1000).toFixed(1)

        const severity = defineSeverity(path)
        logger
          .push({ requestId: request.info.id })
          [severity](`[<== ${statusCode}] ${method.toUpperCase()} ${path} [${respTimeSec} sec]`)
        return h.continue
      }
    })
  }
}
