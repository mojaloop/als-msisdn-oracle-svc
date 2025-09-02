import { Request, ResponseToolkit, ServerApplicationState } from '@hapi/hapi';
import { Enum } from '@mojaloop/central-services-shared';
import * as Handler from '~/server/handlers/participants/{Type}/{ID}/{SubId}';
import * as Domain from '~/domain/participants';
import { logger } from '~/shared/logger';
import { errorResponseDto } from 'test/fixtures';
import {
  deleteParticipantsByTypeAndIDRequestSubId,
  putParticipantsByTypeAndIDRequestSubId,
  postParticipantsByTypeAndIDRequestSubId,
  deleteParticipantsByWrongTypeAndIDRequestSubId,
  putParticipantsByWrongTypeAndIDRequestSubId,
  postParticipantsByWrongTypeAndIDRequestSubId,
  h,
  getParticipantsByTypeAndIDRequestSubId,
  mockPartyMapItemSubId
} from 'test/data/data';
import { IOracleDb } from '~/domain/types';
import { createMockOracleDb } from 'test/unit/__mocks__/util';
// Error imports removed - now testing response format directly

const mockRetrievePartyMapItem = jest.spyOn(Domain, 'retrievePartyMapItem');
const mockCreatePartyMapItem = jest.spyOn(Domain, 'createPartyMapItem');
const mockUpdatePartyMapItem = jest.spyOn(Domain, 'updatePartyMapItem');
const mockDeletePartyMapItem = jest.spyOn(Domain, 'deletePartyMapItem');

describe('server/handler/participants/{Type}/{ID}/{SubId}', (): void => {
  let oracleDB: IOracleDb;
  let serverApp: ServerApplicationState; // hapi server app state

  const mockHapiRequest = (reqDetails: any = {}): Request =>
    ({
      ...reqDetails,
      server: { app: serverApp }
    }) as unknown as Request;

  beforeEach(() => {
    oracleDB = createMockOracleDb();
    serverApp = { logger, oracleDB };
  });

  describe('GET Handler', (): void => {
    beforeAll((): void => {
      mockRetrievePartyMapItem.mockResolvedValue(mockPartyMapItemSubId);
    });

    it('should return a 200 success code.', async (): Promise<void> => {
      const req = mockHapiRequest(getParticipantsByTypeAndIDRequestSubId);
      const response = await Handler.get(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(Enum.Http.ReturnCodes.OK.CODE);
    });

    it('should fail if {Type} is not MSISDN', async (): Promise<void> => {
      const req = mockHapiRequest(deleteParticipantsByWrongTypeAndIDRequestSubId);
      req.params.Type = 'ACCOUNT_ID';

      const response = await Handler.get(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(400);
      expect(response.source).toStrictEqual(
        errorResponseDto('3101', 'Malformed syntax - This service supports only MSISDN ID types')
      );
    });

    it('should fail if ID is a placeholder value {ID}', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...getParticipantsByTypeAndIDRequestSubId,
        params: { ...(getParticipantsByTypeAndIDRequestSubId.params as Record<string, any>) }
      });
      req.params.ID = '{ID}';

      const response = await Handler.get(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(400);
      expect(response.source).toStrictEqual(errorResponseDto('3101', 'Malformed syntax - Invalid ID parameter: {ID}'));
    });

    it('should fail if SubId is undefined', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...getParticipantsByTypeAndIDRequestSubId,
        params: { ...(getParticipantsByTypeAndIDRequestSubId.params as Record<string, any>) }
      });
      delete req.params.SubId;

      const response = await Handler.get(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(404);
    });

    it('should fail if SubId is a placeholder value {SubId}', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...getParticipantsByTypeAndIDRequestSubId,
        params: { ...(getParticipantsByTypeAndIDRequestSubId.params as Record<string, any>) }
      });
      req.params.SubId = '{SubId}';

      const response = await Handler.get(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(400);
      expect(response.source).toStrictEqual(
        errorResponseDto('3101', 'Malformed syntax - Invalid SubId parameter: {SubId}')
      );
    });
  });

  describe('POST Handler', (): void => {
    beforeAll((): void => {
      mockCreatePartyMapItem.mockResolvedValue(undefined);
    });

    it('should fail if ID is empty', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...postParticipantsByTypeAndIDRequestSubId,
        params: { ...(postParticipantsByTypeAndIDRequestSubId.params as Record<string, any>) }
      });
      req.params.ID = '';

      const response = await Handler.post(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(404);
    });

    it('should return a 201 success code.', async (): Promise<void> => {
      const req = mockHapiRequest(postParticipantsByTypeAndIDRequestSubId);
      const response = await Handler.post(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(Enum.Http.ReturnCodes.CREATED.CODE);
    });

    it('should fail if {Type} is not MSISDN', async (): Promise<void> => {
      const req = mockHapiRequest(postParticipantsByWrongTypeAndIDRequestSubId);
      req.params.Type = 'ACCOUNT_ID';

      const response = await Handler.post(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(400);
      expect(response.source).toStrictEqual(
        errorResponseDto('3101', 'Malformed syntax - This service supports only MSISDN ID types')
      );
    });
  });

  describe('PUT Handler', (): void => {
    beforeAll((): void => {
      mockUpdatePartyMapItem.mockResolvedValue();
    });

    it('should fail if ID is empty', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...putParticipantsByTypeAndIDRequestSubId,
        params: { ...(putParticipantsByTypeAndIDRequestSubId.params as Record<string, any>) }
      });
      req.params.ID = '';

      const response = await Handler.put(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(404);
    });

    it('should fail if SubId is empty', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...putParticipantsByTypeAndIDRequestSubId,
        params: { ...(putParticipantsByTypeAndIDRequestSubId.params as Record<string, any>) }
      });
      req.params.SubId = '';

      const response = await Handler.put(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(404);
    });

    it('should return a 200 success code.', async (): Promise<void> => {
      const req = mockHapiRequest(putParticipantsByTypeAndIDRequestSubId);
      const response = await Handler.put(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(Enum.Http.ReturnCodes.OK.CODE);
    });

    it('should fail if {Type} is not MSISDN', async (): Promise<void> => {
      const req = mockHapiRequest(putParticipantsByWrongTypeAndIDRequestSubId);
      req.params.Type = 'ACCOUNT_ID';

      const response = await Handler.put(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(400);
      expect(response.source).toStrictEqual(
        errorResponseDto('3101', 'Malformed syntax - This service supports only MSISDN ID types')
      );
    });
  });

  describe('DELETE Handler', (): void => {
    beforeAll((): void => {
      mockDeletePartyMapItem.mockResolvedValue();
    });

    it('should fail if ID is empty', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...deleteParticipantsByTypeAndIDRequestSubId,
        params: { ...(deleteParticipantsByTypeAndIDRequestSubId.params as Record<string, any>) }
      });
      req.params.ID = '';

      const response = await Handler.del(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(404);
    });

    it('should return a 204 no content code.', async (): Promise<void> => {
      const req = mockHapiRequest(deleteParticipantsByTypeAndIDRequestSubId);
      const response = await Handler.del(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(Enum.Http.ReturnCodes.NOCONTENT.CODE);
    });

    it('should fail if {Type} is not MSISDN', async (): Promise<void> => {
      const req = mockHapiRequest(deleteParticipantsByWrongTypeAndIDRequestSubId);

      const response = await Handler.del(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers
        },
        req,
        h as unknown as ResponseToolkit
      );
      expect(response.statusCode).toBe(400);
      expect(response.source).toStrictEqual(
        errorResponseDto('3101', 'Malformed syntax - This service supports only MSISDN ID types')
      );
    });
  });
});
