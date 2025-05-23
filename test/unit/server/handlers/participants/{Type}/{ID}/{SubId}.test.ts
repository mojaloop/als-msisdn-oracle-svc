import { Request, ResponseToolkit } from '@hapi/hapi'
import { Enum } from '@mojaloop/central-services-shared'
import * as Handler from '~/server/handlers/participants/{Type}/{ID}/{SubId}'
import * as Domain from '~/domain/participants'
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
} from 'test/data/data'
import { IDTypeNotSupported } from '~/model/errors'

jest.mock('~/shared/logger')

const mockRetrievePartyMapItem = jest.spyOn(Domain, 'retrievePartyMapItem')
const mockCreatePartyMapItem = jest.spyOn(Domain, 'createPartyMapItem')
const mockUpdatePartyMapItem = jest.spyOn(Domain, 'updatePartyMapItem')
const mockDeletePartyMapItem = jest.spyOn(Domain, 'deletePartyMapItem')

describe('server/handler/participants/{Type}/{ID}/{SubId}', (): void => {
  describe('GET Handler', (): void => {
    beforeAll((): void => {
      mockRetrievePartyMapItem.mockResolvedValue(mockPartyMapItemSubId)
    })

    it('should return a 200 success code.', async (): Promise<void> => {
      const req = getParticipantsByTypeAndIDRequestSubId as unknown as Request
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
      )
      expect(response.statusCode).toBe(Enum.Http.ReturnCodes.OK.CODE)
    })

    it('should fail if {Type} is not MSISDN', async (): Promise<void> => {
      const req = deleteParticipantsByWrongTypeAndIDRequestSubId as unknown as Request
      req.params.Type = 'ACCOUNT_ID'

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
      )
      expect(response).toStrictEqual(new IDTypeNotSupported())
    })
  })

  describe('POST Handler', (): void => {
    beforeAll((): void => {
      mockCreatePartyMapItem.mockResolvedValue(undefined)
    })

    it('should return a 201 success code.', async (): Promise<void> => {
      const req = postParticipantsByTypeAndIDRequestSubId as unknown as Request
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
      )
      expect(response.statusCode).toBe(Enum.Http.ReturnCodes.CREATED.CODE)
    })

    it('should fail if {Type} is not MSISDN', async (): Promise<void> => {
      const req = postParticipantsByWrongTypeAndIDRequestSubId as unknown as Request
      req.params.Type = 'ACCOUNT_ID'

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
      )
      expect(response).toStrictEqual(new IDTypeNotSupported())
    })
  })

  describe('PUT Handler', (): void => {
    beforeAll((): void => {
      mockUpdatePartyMapItem.mockResolvedValue()
    })

    it('should return a 200 success code.', async (): Promise<void> => {
      const req = putParticipantsByTypeAndIDRequestSubId as unknown as Request
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
      )
      expect(response.statusCode).toBe(Enum.Http.ReturnCodes.OK.CODE)
    })

    it('should fail if {Type} is not MSISDN', async (): Promise<void> => {
      const req = putParticipantsByWrongTypeAndIDRequestSubId as unknown as Request
      req.params.Type = 'ACCOUNT_ID'

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
      )
      expect(response).toStrictEqual(new IDTypeNotSupported())
    })
  })

  describe('DELETE Handler', (): void => {
    beforeAll((): void => {
      mockDeletePartyMapItem.mockResolvedValue()
    })

    it('should return a 204 no content code.', async (): Promise<void> => {
      const req = deleteParticipantsByTypeAndIDRequestSubId as unknown as Request
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
      )
      expect(response.statusCode).toBe(Enum.Http.ReturnCodes.NOCONTENT.CODE)
    })

    it('should fail if {Type} is not MSISDN', async (): Promise<void> => {
      const req = deleteParticipantsByWrongTypeAndIDRequestSubId as unknown as Request

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
      )
      expect(response).toStrictEqual(new IDTypeNotSupported())
    })
  })
})
