import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { Context } from '~/server/plugins';
import { retrievePartyMapItem, createPartyMapItem, updatePartyMapItem, deletePartyMapItem } from '~/domain/participants';
import { PartyMapItem } from '~/model/MSISDN';
import { validateParticipantParams } from '~/shared/validation';
import * as Types from '~/interface/types';

export async function get(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    // Validate parameters
    const validationError = validateParticipantParams(request.params.Type, request.params.ID, h);
    if (validationError) return validationError;
    
    const partyId = request.params.ID;
    const subId = request.query?.partySubIdOrType;
    try {
        const partyMapItem = await retrievePartyMapItem(partyId, subId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responsePartyMapItem: any = { ...partyMapItem };
        if (responsePartyMapItem.subId) {
            responsePartyMapItem.partySubIdOrType = responsePartyMapItem.subId;
            delete responsePartyMapItem.subId;
        }
        return h.response({ partyList: [responsePartyMapItem] }).code(200);
    } catch {
        return h.response({ partyList: [] }).code(200);
    }
}

export async function post(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    // Validate parameters
    const validationError = validateParticipantParams(request.params.Type, request.params.ID, h);
    if (validationError) return validationError;
    
    const partyId = request.params.ID;
    const payload = request.payload as Types.ParticipantsTypeIDPostPutRequest;
    const partyMapItem: PartyMapItem = {
        id: partyId,
        fspId: payload.fspId,
        subId: payload.partySubIdOrType
    };
    const errResult = await createPartyMapItem(partyMapItem);
    // istanbul ignore next
    return h.response(errResult).code(!errResult ? 201 : errResult.statusCode);
}

export async function put(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    // Validate parameters
    const validationError = validateParticipantParams(request.params.Type, request.params.ID, h);
    if (validationError) return validationError;
    
    const partyId = request.params.ID;
    const payload = request.payload as Types.ParticipantsTypeIDPostPutRequest;
    const partyMapItem: PartyMapItem = {
        id: partyId,
        fspId: payload.fspId,
        subId: payload.partySubIdOrType
    };
    await updatePartyMapItem(partyMapItem);
    return h.response().code(200);
}

export async function del(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    // Validate parameters
    const validationError = validateParticipantParams(request.params.Type, request.params.ID, h);
    if (validationError) return validationError;
    
    const partyId = request.params.ID;
    await deletePartyMapItem(partyId);
    return h.response().code(204);
}

export default {
    get,
    post,
    put,
    del
};
