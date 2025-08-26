import { Request, ResponseToolkit } from '@hapi/hapi'
import { Enum } from '@mojaloop/central-services-shared'
import * as Handler from '~/server/handlers/participants/{Type}/{ID}'
import * as Domain from '~/domain/participants'
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
import { IDTypeNotSupported, MalformedParameterError } from '~/model/errors'

jest.mock('~/shared/logger')

const mockRetrievePartyMapItem = jest.spyOn(Domain, 'retrievePartyMapItem')
const mockCreatePartyMapItem = jest.spyOn(Domain, 'createPartyMapItem')
const mockUpdatePartyMapItem = jest.spyOn(Domain, 'updatePartyMapItem')
const mockDeletePartyMapItem = jest.spyOn(Domain, 'deletePartyMapItem')

describe('server/handler/participants/{Type}/{ID}', (): void => {
  describe('GET Handler', (): void => {
    beforeAll((): void => {
      mockRetrievePartyMapItem.mockResolvedValue(mockPartyMapItem)
    })

    it('should return 404 if ID is empty string', async (): Promise<void> => {
      const req = { 
        ...getParticipantsByTypeAndIDRequest,
        params: { ...(getParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      } as unknown as Request
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
      expect(response.statusCode).toBe(404)
    })

    it('should return a 200 success code.', async (): Promise<void> => {
      const req = getParticipantsByTypeAndIDRequest as unknown as Request
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
      const req = deleteParticipantsByWrongTypeAndIDRequest as unknown as Request
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

    it('should fail if ID is a placeholder value {ID}', async (): Promise<void> => {
      const req = { 
        ...getParticipantsByTypeAndIDRequest,
        params: { ...(getParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      } as unknown as Request
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
      expect(response).toStrictEqual(new MalformedParameterError('ID', '{ID}'))
    })

    it('should fail if ID contains curly braces', async (): Promise<void> => {
      const req = { 
        ...getParticipantsByTypeAndIDRequest,
        params: { ...(getParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      } as unknown as Request
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
      expect(response).toStrictEqual(new MalformedParameterError('ID', 'some{value}'))
    })
  })

  describe('POST Handler', (): void => {
    beforeAll((): void => {
      mockCreatePartyMapItem.mockResolvedValue(undefined)
    })

    it('should return a 201 success code.', async (): Promise<void> => {
      const req = postParticipantsByTypeAndIDRequest as unknown as Request
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
      const req = postParticipantsByWrongTypeAndIDRequest as unknown as Request
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

    it('should fail if ID is a placeholder value {ID}', async (): Promise<void> => {
      const req = { 
        ...postParticipantsByTypeAndIDRequest,
        params: { ...(postParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      } as unknown as Request
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
      expect(response).toStrictEqual(new MalformedParameterError('ID', '{ID}'))
    })
  })

  describe('PUT Handler', (): void => {
    beforeAll((): void => {
      mockUpdatePartyMapItem.mockResolvedValue()
    })

    it('should return a 200 success code.', async (): Promise<void> => {
      const req = putParticipantsByTypeAndIDRequest as unknown as Request
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
      const req = putParticipantsByWrongTypeAndIDRequest as unknown as Request
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

    it('should fail if ID is a placeholder value {ID}', async (): Promise<void> => {
      const req = { 
        ...putParticipantsByTypeAndIDRequest,
        params: { ...(putParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      } as unknown as Request
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
      expect(response).toStrictEqual(new MalformedParameterError('ID', '{ID}'))
    })
  })

  describe('DELETE Handler', (): void => {
    beforeAll((): void => {
      mockDeletePartyMapItem.mockResolvedValue()
    })

    it('should return a 204 no content code.', async (): Promise<void> => {
      const req = deleteParticipantsByTypeAndIDRequest as unknown as Request
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
      const req = deleteParticipantsByWrongTypeAndIDRequest as unknown as Request

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

    it('should fail if ID is a placeholder value {ID}', async (): Promise<void> => {
      const req = { 
        ...deleteParticipantsByTypeAndIDRequest,
        params: { ...(deleteParticipantsByTypeAndIDRequest.params as Record<string, any>) }
      } as unknown as Request
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
      expect(response).toStrictEqual(new MalformedParameterError('ID', '{ID}'))
    })
  })
})
