import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import { Context } from '~/server/plugins'
import Boom from '@hapi/boom'

export async function post(_context: Context, _req: Request, _h: ResponseToolkit): Promise<ResponseObject> {
  return Boom.notImplemented() as unknown as ResponseObject
}

export default {
  post
}
