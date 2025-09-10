import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import { Context } from '~/server/plugins'
import { createParticipantController } from '~/domain/createParticipantController'
import * as Types from '~/interface/types'

export async function get(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const { Type, ID } = request.params

  const controller = createParticipantController(request.server.app)
  const subType = request.query?.partySubIdOrType
  const { result, statusCode } = subType
    ? await controller.handleGetPartyById(Type, ID, subType)
    : await controller.handleGetPartyById(Type, ID)

  return h.response(result).code(statusCode)
}

export async function post(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const { Type, ID } = request.params

  const { result, statusCode } = await createParticipantController(request.server.app).handlePostParty(
    Type,
    ID,
    request.payload as Types.ParticipantsTypeIDPostPutRequest
  )

  return h.response(result).code(statusCode)
}

export async function put(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const { Type, ID } = request.params

  const { result, statusCode } = await createParticipantController(request.server.app).handlePutParty(
    Type,
    ID,
    request.payload as Types.ParticipantsTypeIDPostPutRequest
  )
  // todo: think, if we need to validate payload?

  return h.response(result).code(statusCode)
}

export async function del(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const { Type, ID } = request.params

  const { result, statusCode } = await createParticipantController(request.server.app).handleDeleteParty(Type, ID)

  return h.response(result).code(statusCode)
}

export default {
  get,
  post,
  put,
  del
}
