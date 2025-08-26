import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { Context } from '~/server/plugins';
import { retrievePartyMapItem, createPartyMapItem, updatePartyMapItem, deletePartyMapItem } from '~/domain/participants';
import { Schemas } from '@mojaloop/api-snippets/lib/fspiop/v1_1';
import { PartyMapItem } from '~/model/MSISDN';
import * as Types from '~/interface/types';
import { IDTypeNotSupported, MalformedParameterError } from '../../../../../model/errors';
import { boomify } from '@hapi/boom';

export async function get(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    if (request.params.Type !== 'MSISDN') {
        return boomify(new IDTypeNotSupported());
    }

    const partyId = request.params.ID;
    const subId = request.params.SubId;
    
    // Validate that ID is present
    if (!partyId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - ID parameter is missing' } }).code(404);
    }
    
    // Validate that SubId is present
    if (!subId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - SubId parameter is missing' } }).code(404);
    }
    
    // Validate that ID is not a placeholder value
    if (partyId === '{ID}' || partyId.includes('{') || partyId.includes('}')) {
        return boomify(new MalformedParameterError('ID', partyId));
    }
    
    // Validate that SubId is not a placeholder value
    if (subId === '{SubId}' || subId.includes('{') || subId.includes('}')) {
        return boomify(new MalformedParameterError('SubId', subId));
    }
    const partyMapItem = await retrievePartyMapItem(partyId, subId);
    return h.response({ partyList: [partyMapItem] }).code(200);
}

export async function post(_context: Context, request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    if (request.params.Type !== 'MSISDN') {
        return boomify(new IDTypeNotSupported());
    }

    const partyId = request.params.ID;
    const subId = request.params.SubId;
    
    // Validate that ID is present
    if (!partyId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - ID parameter is missing' } }).code(404);
    }
    
    // Validate that SubId is present
    if (!subId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - SubId parameter is missing' } }).code(404);
    }
    
    // Validate that ID is not a placeholder value
    if (partyId === '{ID}' || partyId.includes('{') || partyId.includes('}')) {
        return boomify(new MalformedParameterError('ID', partyId));
    }
    
    // Validate that SubId is not a placeholder value
    if (subId === '{SubId}' || subId.includes('{') || subId.includes('}')) {
        return boomify(new MalformedParameterError('SubId', subId));
    }
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
    if (request.params.Type !== 'MSISDN') {
        return boomify(new IDTypeNotSupported());
    }

    const partyId = request.params.ID;
    const subId = request.params.SubId;
    
    // Validate that ID is present
    if (!partyId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - ID parameter is missing' } }).code(404);
    }
    
    // Validate that SubId is present
    if (!subId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - SubId parameter is missing' } }).code(404);
    }
    
    // Validate that ID is not a placeholder value
    if (partyId === '{ID}' || partyId.includes('{') || partyId.includes('}')) {
        return boomify(new MalformedParameterError('ID', partyId));
    }
    
    // Validate that SubId is not a placeholder value
    if (subId === '{SubId}' || subId.includes('{') || subId.includes('}')) {
        return boomify(new MalformedParameterError('SubId', subId));
    }
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
    if (request.params.Type !== 'MSISDN') {
        return boomify(new IDTypeNotSupported());
    }

    const partyId = request.params.ID;
    const subId = request.params.SubId;
    
    // Validate that ID is present
    if (!partyId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - ID parameter is missing' } }).code(404);
    }
    
    // Validate that SubId is present
    if (!subId) {
        return h.response({ errorInformation: { errorCode: '3002', errorDescription: 'Unknown URI - SubId parameter is missing' } }).code(404);
    }
    
    // Validate that ID is not a placeholder value
    if (partyId === '{ID}' || partyId.includes('{') || partyId.includes('}')) {
        return boomify(new MalformedParameterError('ID', partyId));
    }
    
    // Validate that SubId is not a placeholder value
    if (subId === '{SubId}' || subId.includes('{') || subId.includes('}')) {
        return boomify(new MalformedParameterError('SubId', subId));
    }
    await deletePartyMapItem(partyId, subId);
    return h.response().code(204);
}

export default {
    get,
    post,
    put,
    del
};
