import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { boomify } from '@hapi/boom';
import { Context } from '~/server/plugins';
import { retrievePartyMapItem, createPartyMapItem, updatePartyMapItem, deletePartyMapItem } from '~/domain/participants';
import { PartyMapItem } from '~/model/MSISDN';
import { IDTypeNotSupported, MalformedParameterError } from '~/model/errors';
import * as Types from '~/interface/types';

export async function get(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    if (request.params.Type !== 'MSISDN') {
        return boomify(new IDTypeNotSupported());
    }

    const partyId = request.params.ID;
    
    // Validate that ID is present
    if (!partyId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - ID parameter is missing' } }).code(404);
    }
    
    // Validate that ID is not a placeholder value
    if (partyId === '{ID}' || partyId.includes('{') || partyId.includes('}')) {
        return boomify(new MalformedParameterError('ID', partyId));
    }
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
    if (request.params.Type !== 'MSISDN') {
        return boomify(new IDTypeNotSupported());
    }

    const partyId = request.params.ID;
    
    // Validate that ID is present
    if (!partyId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - ID parameter is missing' } }).code(404);
    }
    
    // Validate that ID is not a placeholder value
    if (partyId === '{ID}' || partyId.includes('{') || partyId.includes('}')) {
        return boomify(new MalformedParameterError('ID', partyId));
    }
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
    if (request.params.Type !== 'MSISDN') {
        return boomify(new IDTypeNotSupported());
    }

    const partyId = request.params.ID;
    
    // Validate that ID is present
    if (!partyId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - ID parameter is missing' } }).code(404);
    }
    
    // Validate that ID is not a placeholder value
    if (partyId === '{ID}' || partyId.includes('{') || partyId.includes('}')) {
        return boomify(new MalformedParameterError('ID', partyId));
    }
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
    if (request.params.Type !== 'MSISDN') {
        return boomify(new IDTypeNotSupported());
    }

    const partyId = request.params.ID;
    
    // Validate that ID is present
    if (!partyId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - ID parameter is missing' } }).code(404);
    }
    
    // Validate that ID is not a placeholder value
    if (partyId === '{ID}' || partyId.includes('{') || partyId.includes('}')) {
        return boomify(new MalformedParameterError('ID', partyId));
    }
    await deletePartyMapItem(partyId);
    return h.response().code(204);
}

export default {
    get,
    post,
    put,
    del
};
