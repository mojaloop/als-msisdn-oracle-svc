process.env.ALS_MSISDN_ORACLE_PORT = '23000'

import { Server } from '@hapi/hapi'
import createServer from '~/server/create'
import config from '~/shared/config'
import { NotFoundError, RetriableDbError } from '~/model/errors'
import { ParticipantServiceDeps } from '~/domain/types'
import { logger } from '~/shared/logger'
import { createMockOracleDb } from 'test/unit/__mocks__/util'

// const makeUrl = (ID: string, Type: string = 'MSISDN') => `/participants/${Type}/${ID}`

describe('create server Tests -->', () => {
  let deps: ParticipantServiceDeps

  beforeEach(() => {
    deps = {
      oracleDB: createMockOracleDb(),
      logger
    }
  })

  test('should create server', async () => {
    const server = await createServer(config, deps)
    expect(server).toBeDefined()
  })

  describe('e2e API Tests -->', () => {
    let server: Server

    const injectHttpRequest = async <T>(
      url = '/',
      method = 'GET',
      payload: object | undefined = undefined,
      headers = {}
    ) => server.inject<T>({ url, method, headers, payload })

    beforeEach(async () => {
      server = await createServer(config, deps)
    })

    afterEach(async () => {
      await server.stop()
    })

    test('should handle healthCheck request', async () => {
      const { statusCode, payload } = await injectHttpRequest('/health')
      expect(statusCode).toBe(200)
      expect(JSON.parse(payload).status).toBe('OK')
    })

    describe('GET /participants/... APIs Tests -->', () => {
      test('should return 400 for unsupported Type', async () => {
        const { statusCode, payload } = await injectHttpRequest('/participants/ABC/123')
        expect(statusCode).toBe(400)
        expect(JSON.parse(payload).errorInformation).toBeDefined()
      })

      test('should return 404 for non-existent MSISDN', async () => {
        deps.oracleDB.retrieve = jest.fn().mockRejectedValue(new NotFoundError('oracleMSISDN', '123'))
        const { statusCode } = await injectHttpRequest('/participants/MSISDN/123')
        expect(statusCode).toBe(404)
      })

      test('should return 503 in case of retriable DB error', async () => {
        deps.oracleDB.retrieve = jest.fn().mockRejectedValue(new RetriableDbError('Error'))
        // todo: think how to emulate raw PROTOCOL_CONNECTION_LOST error
        const { statusCode } = await injectHttpRequest('/participants/MSISDN/123')
        expect(statusCode).toBe(503)
      })
    })
  })
})
