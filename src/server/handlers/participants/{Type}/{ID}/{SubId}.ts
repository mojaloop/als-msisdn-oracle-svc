import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { Context } from '~/server/plugins';
import { retrievePartyMapItem, createPartyMapItem, updatePartyMapItem, deletePartyMapItem } from '~/domain/participants';
import { Schemas } from '@mojaloop/api-snippets/lib/fspiop/v1_1';
import { PartyMapItem } from '~/model/MSISDN';
import * as Types from '~/interface/types';
import { validateParticipantSubIdParams } from '~/shared/validation';

export async function get(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    // Validate parameters
    const validationError = validateParticipantSubIdParams(request.params.Type, request.params.ID, request.params.SubId, h);
    if (validationError) return validationError;
    
    const partyId = request.params.ID;
    const subId = request.params.SubId;
    const partyMapItem = await retrievePartyMapItem(partyId, subId);
    return h.response({ partyList: [partyMapItem] }).code(200);
}

export async function post(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    // Validate parameters
    const validationError = validateParticipantSubIdParams(request.params.Type, request.params.ID, request.params.SubId, h);
    if (validationError) return validationError;
    
    const partyId = request.params.ID;
    const subId = request.params.SubId;
    const payload = request.payload as Schemas.ParticipantsTypeIDSubIDPostRequest;
    const partyMapItem: PartyMapItem = {
        id: partyId,
        subId,
        fspId: payload.fspId
    };
    const errResult = await createPartyMapItem(partyMapItem);
    // istanbul ignore next
    return h.response(errResult).code(!errResult ? 201 : errResult.statusCode);
}

export async function put(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    // Validate parameters
    const validationError = validateParticipantSubIdParams(request.params.Type, request.params.ID, request.params.SubId, h);
    if (validationError) return validationError;
    
    const partyId = request.params.ID;
    const subId = request.params.SubId;
    const payload = request.payload as Types.ParticipantsTypeIDPostPutRequest;
    const partyMapItem: PartyMapItem = {
        id: partyId,
        subId,
        fspId: payload.fspId
    };
    await updatePartyMapItem(partyMapItem);
    return h.response().code(200);
}

export async function del(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    // Validate parameters
    const validationError = validateParticipantSubIdParams(request.params.Type, request.params.ID, request.params.SubId, h);
    if (validationError) return validationError;
    
    const partyId = request.params.ID;
    const subId = request.params.SubId;
    await deletePartyMapItem(partyId, subId);
    return h.response().code(204);
}

export default {
    get,
    post,
    put,
    del
};
