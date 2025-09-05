import { Request, ResponseToolkit, ServerApplicationState } from '@hapi/hapi'
import { Enum } from '@mojaloop/central-services-shared'
import * as Handler from '~/server/handlers/participants/{Type}/{ID}'
import * as Domain from '~/domain/participants'
import { logger } from '~/shared/logger'
import { createMockOracleDb } from 'test/unit/__mocks__/util'
import { errorResponseDto } from 'test/fixtures'
import {
  deleteParticipantsByTypeAndIDRequest,
  putParticipantsByTypeAndIDRequest,
  postParticipantsByTypeAndIDRequest,
  deleteParticipantsByWrongTypeAndIDRequest,
  putParticipantsByWrongTypeAndIDRequest,
  postParticipantsByWrongTypeAndIDRequest,
  h,
  getParticipantsByTypeAndIDRequest,
  mockPartyMapItem
} from 'test/data/data'
import { IOracleDb } from '~/domain/types'
// Error imports removed - now testing response format directly

const mockRetrievePartyMapItem = jest.spyOn(Domain, 'retrievePartyMapItem')
const mockCreatePartyMapItem = jest.spyOn(Domain, 'createPartyMapItem')
const mockUpdatePartyMapItem = jest.spyOn(Domain, 'updatePartyMapItem')
const mockDeletePartyMapItem = jest.spyOn(Domain, 'deletePartyMapItem')

describe('server/handler/participants/{Type}/{ID}', (): void => {
  let oracleDB: IOracleDb
  let serverApp: ServerApplicationState // hapi server app state

  const mockHapiRequest = (reqDetails: any = {}): Request =>
    ({
      ...reqDetails,
      server: { app: serverApp }
    }) as unknown as Request

  beforeEach(() => {
    oracleDB = createMockOracleDb()
    serverApp = { logger, oracleDB }
  })

  describe('GET Handler', (): void => {
    beforeAll((): void => {
      mockRetrievePartyMapItem.mockResolvedValue(mockPartyMapItem)
    })

    it('should return 400 validation error if ID is empty string', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...getParticipantsByTypeAndIDRequest,
        params: { ...(getParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      })
      req.params.ID = ''

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
      expect(response.statusCode).toBe(400)
    })

    it('should return 400 validation error if ID is undefined', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...getParticipantsByTypeAndIDRequest,
        params: { ...(getParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      })
      delete req.params.ID

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
      expect(response.statusCode).toBe(400)
    })

    it('should return a 200 success code.', async (): Promise<void> => {
      const req = mockHapiRequest(getParticipantsByTypeAndIDRequest)
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

    it('should return empty partyList when retrievePartyMapItem throws error', async (): Promise<void> => {
      mockRetrievePartyMapItem.mockRejectedValueOnce(new Error('Not found'))
      const req = mockHapiRequest(getParticipantsByTypeAndIDRequest)
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

    it('should return 400 validation error if {Type} is not MSISDN', async (): Promise<void> => {
      const req = mockHapiRequest(deleteParticipantsByWrongTypeAndIDRequest)
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
      expect(response.statusCode).toBe(400)
      expect(response.source).toStrictEqual(
        errorResponseDto('3101', 'Malformed syntax - This service supports only MSISDN ID types')
      )
    })

    it('should return 400 validation error if ID is a placeholder value {ID}', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...getParticipantsByTypeAndIDRequest,
        params: { ...(getParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      })
      req.params.ID = '{ID}'

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
      expect(response.statusCode).toBe(400)
      expect(response.source).toStrictEqual(errorResponseDto('3101', 'Malformed syntax - Invalid ID parameter: {ID}'))
    })

    it('should return 400 validation error if ID contains curly braces', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...getParticipantsByTypeAndIDRequest,
        params: { ...(getParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      })
      req.params.ID = 'some{value}'

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
      expect(response.statusCode).toBe(400)
      expect(response.source).toStrictEqual(
        errorResponseDto('3101', 'Malformed syntax - Invalid ID parameter: some{value}')
      )
    })
  })

  describe('POST Handler', (): void => {
    beforeAll((): void => {
      mockCreatePartyMapItem.mockResolvedValue(undefined)
    })

    it('should return a 201 success code.', async (): Promise<void> => {
      const req = mockHapiRequest(postParticipantsByTypeAndIDRequest)
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

    it('should return 400 validation error if {Type} is not MSISDN', async (): Promise<void> => {
      const req = mockHapiRequest(postParticipantsByWrongTypeAndIDRequest)
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
      expect(response.statusCode).toBe(400)
      expect(response.source).toStrictEqual(
        errorResponseDto('3101', 'Malformed syntax - This service supports only MSISDN ID types')
      )
    })

    it('should return 400 validation error if ID is a placeholder value {ID}', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...postParticipantsByTypeAndIDRequest,
        params: { ...(postParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      })
      req.params.ID = '{ID}'

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
      expect(response.statusCode).toBe(400)
      expect(response.source).toStrictEqual(errorResponseDto('3101', 'Malformed syntax - Invalid ID parameter: {ID}'))
    })
  })

  describe('PUT Handler', (): void => {
    beforeAll((): void => {
      mockUpdatePartyMapItem.mockResolvedValue()
    })

    it('should return a 200 success code.', async (): Promise<void> => {
      const req = mockHapiRequest(putParticipantsByTypeAndIDRequest)
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

    it('should return 400 validation error if {Type} is not MSISDN', async (): Promise<void> => {
      const req = mockHapiRequest(putParticipantsByWrongTypeAndIDRequest)
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
      expect(response.statusCode).toBe(400)
      expect(response.source).toStrictEqual(
        errorResponseDto('3101', 'Malformed syntax - This service supports only MSISDN ID types')
      )
    })

    it('should return 400 validation error if ID is a placeholder value {ID}', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...putParticipantsByTypeAndIDRequest,
        params: { ...(putParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      })
      req.params.ID = '{ID}'

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
      expect(response.statusCode).toBe(400)
      expect(response.source).toStrictEqual(errorResponseDto('3101', 'Malformed syntax - Invalid ID parameter: {ID}'))
    })
  })

  describe('DELETE Handler', (): void => {
    beforeAll((): void => {
      mockDeletePartyMapItem.mockResolvedValue()
    })

    it('should return a 204 no content code.', async (): Promise<void> => {
      const req = mockHapiRequest(deleteParticipantsByTypeAndIDRequest)
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

    it('should return 400 validation error if {Type} is not MSISDN', async (): Promise<void> => {
      const req = mockHapiRequest(deleteParticipantsByWrongTypeAndIDRequest)

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
      expect(response.statusCode).toBe(400)
      expect(response.source).toStrictEqual(
        errorResponseDto('3101', 'Malformed syntax - This service supports only MSISDN ID types')
      )
    })

    it('should return 400 validation error if ID is a placeholder value {ID}', async (): Promise<void> => {
      const req = mockHapiRequest({
        ...deleteParticipantsByTypeAndIDRequest,
        params: { ...(deleteParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      })
      req.params.ID = '{ID}'

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
      expect(response.statusCode).toBe(400)
      expect(response.source).toStrictEqual(errorResponseDto('3101', 'Malformed syntax - Invalid ID parameter: {ID}'))
    })
  })
})
