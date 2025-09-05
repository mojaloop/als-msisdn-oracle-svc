import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { Enum } from '@mojaloop/central-services-shared';

import { createParticipantController } from '~/domain/createParticipantController';
import { Context } from '~/server/plugins';
import { PostParticipantsBulkRequest } from '~/interface/types';

const { FSPIOP } = Enum.Http.Headers;

export const handlePostBulk = async (_context: Context, req: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  const controller = createParticipantController(req.server.app);
  const { result, statusCode } = await controller.handleBulkCreate(
    req.payload as PostParticipantsBulkRequest,
    req.headers[FSPIOP.SOURCE]
  );

  return h.response(result).code(statusCode);
};
