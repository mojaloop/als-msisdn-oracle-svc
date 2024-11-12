import { Request, ResponseToolkit } from '@hapi/hapi'
import * as Handler from '~/server/handlers/health'
import { Enum } from '@mojaloop/central-services-shared'
import { h, getHealthRequest } from 'test/data/data'

jest.mock('~/shared/logger')

describe('server/handler/health', (): void => {
  describe('POST Handler', (): void => {
    it('should return a not implemented error.', async (): Promise<void> => {
      const req = getHealthRequest as unknown as Request
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
  })
})
