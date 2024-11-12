import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import { Context } from '~/server/plugins'
import { retrievePartyMapItem, createPartyMapItem, updatePartyMapItem, deletePartyMapItem } from '~/domain/participants'
import { PartyMapItem } from '~/model/MSISDN'
import * as Types from '~/interface/types'
import { IDTypeNotSupported } from '../../../../model/errors'
import { boomify } from '@hapi/boom'

export async function get(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  if (request.params.Type !== 'MSISDN') {
    return boomify(new IDTypeNotSupported())
  }

  const partyId = request.params.ID
  const subId = request.query?.partySubIdOrType
  const partyMapItem = await retrievePartyMapItem(partyId, subId)
  return h.response({ partyList: [partyMapItem] }).code(200)
}

export async function post(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  if (request.params.Type !== 'MSISDN') {
    return boomify(new IDTypeNotSupported())
  }

  const partyId = request.params.ID
  const payload = request.payload as Types.ParticipantsTypeIDPostPutRequest
  const partyMapItem: PartyMapItem = {
    id: partyId,
    fspId: payload.fspId,
    subId: payload.partySubIdOrType
  }
  await createPartyMapItem(partyMapItem)
  return h.response().code(201)
}

export async function put(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  if (request.params.Type !== 'MSISDN') {
    return boomify(new IDTypeNotSupported())
  }

  const partyId = request.params.ID
  const payload = request.payload as Types.ParticipantsTypeIDPostPutRequest
  const partyMapItem: PartyMapItem = {
    id: partyId,
    fspId: payload.fspId,
    subId: payload.partySubIdOrType
  }
  await updatePartyMapItem(partyMapItem)
  return h.response().code(200)
}

export async function del(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  if (request.params.Type !== 'MSISDN') {
    return boomify(new IDTypeNotSupported())
  }

  const partyId = request.params.ID
  await deletePartyMapItem(partyId)
  return h.response().code(204)
}

export default {
  get,
  post,
  put,
  del
}
