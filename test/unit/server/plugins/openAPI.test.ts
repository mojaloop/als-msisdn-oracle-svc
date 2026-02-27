/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the 2020-2025 Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Mojaloop Foundation

 * Lewis Daly <lewis@vesselstech.com>

 --------------
 ******/

import { Server, Request, ResponseToolkit } from '@hapi/hapi'
import index from '~/index'
import Config from '~/shared/config'
import { Context } from '~/server/plugins'

// Import handlers for mocking
import Handlers from '~/server/handlers'

// Mock data
import Headers from '../../../data/headers.json'
import MockParticipantPostData from '../../../data/mockParticipantsPost.json'
import MockParticipantsByTypeAndIDPost from '../../../data/mockParticipantsByTypeAndIDPost.json'
import MockParticipantsByTypeAndIDPut from '../../../data/mockParticipantsByTypeAndIDPut.json'
import * as fixtures from 'test/fixtures'

jest.mock('~/lib/db')

describe('openAPI', () => {
  let server: Server

  beforeAll(async (): Promise<void> => {
    // Override the port to allow parallel tests
    Config.PORT = 33390
    server = await index.server.run(Config)
  })

  afterAll(async (): Promise<void> => {
    await server.stop({ timeout: 100 })
  })

  it('schema validation - missing fields', async (): Promise<void> => {
    // const mockParticipantsPost = jest.spyOn(Handlers, 'ParticipantsPost')
    // mockParticipantsPost.mockImplementationOnce((_context: Context, _req: Request, h: ResponseToolkit) => Promise.resolve(h.response().code(400)))

    const payloadMissingId = Object.assign({}, MockParticipantPostData.payload as Record<string, unknown>)
    delete payloadMissingId.requestId

    const request = {
      method: 'POST',
      url: '/participants',
      headers: Headers,
      payload: payloadMissingId
    }

    const expected = {
      errorInformation: {
        errorCode: '3102',
        errorDescription: "Missing mandatory element - /requestBody must have required property 'requestId'"
      }
    }

    const response = await server.inject(request)
    expect(response.statusCode).toBe(400)
    expect(response.result).toStrictEqual(expected)
  })

  it('POST schema validation - missing fields', async (): Promise<void> => {
    const ParticipantsByTypeAndIDPost = jest.spyOn(Handlers, 'ParticipantsByTypeAndIDPost')
    ParticipantsByTypeAndIDPost.mockImplementationOnce((_context: Context, _req: Request, h: ResponseToolkit) =>
      Promise.resolve(h.response().code(201))
    )

    const payloadMissingId = Object.assign({}, MockParticipantsByTypeAndIDPost.payload as Record<string, unknown>)
    delete payloadMissingId.fspId

    const request = {
      method: 'POST',
      url: '/participants/MSISDN/73f22dbf-e322-44df-b407-f5a80ace9e02',
      headers: Headers,
      payload: payloadMissingId
    }

    const expected = {
      errorInformation: {
        errorCode: '3102',
        errorDescription: "Missing mandatory element - /requestBody must have required property 'fspId'"
      }
    }

    const response = await server.inject(request)
    expect(response.statusCode).toBe(400)
    expect(response.result).toStrictEqual(expected)
  })

  it('should pass validation with requestID as ULID', async () => {
    const request = {
      method: 'POST',
      url: '/participants',
      headers: Headers,
      payload: fixtures.mockPostParticipantsBulkRequest({ requestId: '01JE9A8X3GDF9N07T0T4ZZQCTZ' })
    }

    const response = await server.inject(request)
    expect(response.statusCode).toBe(201)
  })

  it('PUT schema validation - missing fields', async (): Promise<void> => {
    const ParticipantsByTypeAndIDPut = jest.spyOn(Handlers, 'ParticipantsByTypeAndIDPut')
    ParticipantsByTypeAndIDPut.mockImplementationOnce((_context: Context, _req: Request, h: ResponseToolkit) =>
      Promise.resolve(h.response().code(200))
    )

    const payloadMissingId = Object.assign({}, MockParticipantsByTypeAndIDPut.payload as Record<string, unknown>)
    delete payloadMissingId.fspId

    const request = {
      method: 'PUT',
      url: '/participants/MSISDN/73f22dbf-e322-44df-b407-f5a80ace9e02',
      headers: Headers,
      payload: payloadMissingId
    }

    const expected = {
      errorInformation: {
        errorCode: '3102',
        errorDescription: "Missing mandatory element - /requestBody must have required property 'fspId'"
      }
    }

    const response = await server.inject(request)
    expect(response.statusCode).toBe(400)
    expect(response.result).toStrictEqual(expected)
  })
})
