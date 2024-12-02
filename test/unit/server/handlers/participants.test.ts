import { Request, ResponseToolkit } from '@hapi/hapi'
import { handlePostBulk } from '~/server/handlers/participants'

import { h, postParticipantsRequest } from 'test/data/data'
import { createMockHapiServer } from '../../__mocks__/util'

const createMockRequest = () => ({
  ...postParticipantsRequest,
  server: createMockHapiServer()
})

describe('server/handler/participants', () => {
  describe('POST Handler', () => {
    it('should return proper statusCode is party was created', async (): Promise<void> => {
      const req = createMockRequest() as unknown as Request
      const response = await handlePostBulk(
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
      expect(response.statusCode).toBe(201)
    })
  })
})
