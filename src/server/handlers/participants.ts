import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { Enum } from '@mojaloop/central-services-shared';
import { ParticipantService } from '~/domain/ParticipantService';
import { Context } from '~/server/plugins';
import { PostParticipantsBulkRequest } from '~/interface/types';

const { FSPIOP } = Enum.Http.Headers;

export const handlePostBulk = async (_context: Context, req: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const { oracleDB, logger } = req.server.app;

    const service = new ParticipantService({ oracleDB, logger });
    const result = await service.bulkCreate(req.payload as PostParticipantsBulkRequest, req.headers[FSPIOP.SOURCE]);

    return h.response(result).code(201);
};
