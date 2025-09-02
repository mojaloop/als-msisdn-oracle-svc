import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { Context } from '~/server/plugins';
import { createParticipantController } from '~/domain/createParticipantController';
import * as Types from '~/interface/types';

export async function get(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const { Type, ID, SubId } = request.params;

  const { result, statusCode } = await createParticipantController(request.server.app).handleGetPartyById(
    Type,
    ID,
    SubId
  );

  return h.response(result).code(statusCode);
}

export async function post(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const { Type, ID, SubId } = request.params;

  const { result, statusCode } = await createParticipantController(request.server.app).handlePostParty(
    Type,
    ID,
    request.payload as Types.ParticipantsTypeIDPostPutRequest,
    SubId
  );

  return h.response(result).code(statusCode);
}

export async function put(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const { Type, ID, SubId } = request.params;

  const { result, statusCode } = await createParticipantController(request.server.app).handlePutParty(
    Type,
    ID,
    request.payload as Types.ParticipantsTypeIDPostPutRequest,
    SubId
  );
  // todo: think, if we need to validate payload?

  return h.response(result).code(statusCode);
}

export async function del(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const { Type, ID, SubId } = request.params;

  const { result, statusCode } = await createParticipantController(request.server.app).handleDeleteParty(
    Type,
    ID,
    SubId
  );

  return h.response(result).code(statusCode);
}

export default {
  get,
  post,
  put,
  del
};
