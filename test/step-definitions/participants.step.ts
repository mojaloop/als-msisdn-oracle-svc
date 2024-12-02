import path from 'path'
import { loadFeature, defineFeature } from 'jest-cucumber'
import { Server, ServerInjectResponse } from '@hapi/hapi'
import Config from '~/shared/config'
import * as Domain from '~/domain/participants'

import OracleServer from '../../src/server'
import { PartyMapItem } from '~/model/MSISDN'
import Headers from '../data/headers.json'

const mockRetrievePartyMapItem = jest.spyOn(Domain, 'retrievePartyMapItem')
const mockCreatePartyMapItem = jest.spyOn(Domain, 'createPartyMapItem')
const mockUpdatePartyMapItem = jest.spyOn(Domain, 'updatePartyMapItem')
const mockDeletePartyMapItem = jest.spyOn(Domain, 'deletePartyMapItem')
const retrievedPartyMapItem: PartyMapItem = {
  id: '987654321',
  fspId: 'dfspa'
}

const featurePath = path.join(__dirname, '../features/participants.scenario.feature')
const feature = loadFeature(featurePath)

defineFeature(feature, (test): void => {
  let server: Server
  let response: ServerInjectResponse

  afterEach(async () => {
    await server.stop()
  })

  test('GET participants/{Type}/{ID} request', ({ given, when, then }): void => {
    given('als-msisdn-oracle-svc server', async (): Promise<Server> => {
      server = await OracleServer.run(Config)
      return server
    })

    when('an ALS requests a valid GET /participants/{Type}/{ID} request', async (): Promise<ServerInjectResponse> => {
      mockRetrievePartyMapItem.mockResolvedValueOnce(retrievedPartyMapItem)
      const request = {
        method: 'GET',
        url: '/participants/MSISDN/fb2f2b12-5107-48f1-a93d-52b154270038',
        headers: Headers
      }
      response = await server.inject(request)
      return response
    })

    then('I respond with a 200 OK', (): void => {
      expect(response.statusCode).toBe(200)
      expect(mockRetrievePartyMapItem).toBeCalledWith('fb2f2b12-5107-48f1-a93d-52b154270038', undefined)
    })
  })

  test('POST participants/{Type}/{ID} request', ({ given, when, then }): void => {
    given('als-msisdn-oracle-svc server', async (): Promise<Server> => {
      server = await OracleServer.run(Config)
      return server
    })

    when('an ALS requests a valid POST /participants/{Type}/{ID} request', async (): Promise<ServerInjectResponse> => {
      mockCreatePartyMapItem.mockResolvedValueOnce()
      const request = {
        method: 'POST',
        url: '/participants/MSISDN/fb2f2b12-5107-48f1-a93d-52b154270038',
        headers: Headers,
        payload: {
          currency: 'USD',
          fspId: 'dfspa'
        }
      }
      response = await server.inject(request)
      return response
    })

    then('I respond with a 201 Created', (): void => {
      expect(response.statusCode).toBe(201)
      expect(mockCreatePartyMapItem).toBeCalledWith({ fspId: 'dfspa', id: 'fb2f2b12-5107-48f1-a93d-52b154270038' })
    })
  })

  test('PUT participants/{Type}/{ID} request', ({ given, when, then }): void => {
    given('als-msisdn-oracle-svc server', async (): Promise<Server> => {
      server = await OracleServer.run(Config)
      return server
    })

    when('an ALS requests a valid PUT /participants/{Type}/{ID} request', async (): Promise<ServerInjectResponse> => {
      mockUpdatePartyMapItem.mockResolvedValueOnce()
      const request = {
        method: 'PUT',
        url: '/participants/MSISDN/fb2f2b12-5107-48f1-a93d-52b154270038',
        headers: Headers,
        payload: {
          currency: 'USD',
          fspId: 'dfspa'
        }
      }
      response = await server.inject(request)
      return response
    })

    then('I respond with a 200 OK', (): void => {
      expect(response.statusCode).toBe(200)
      expect(mockUpdatePartyMapItem).toBeCalledWith({ fspId: 'dfspa', id: 'fb2f2b12-5107-48f1-a93d-52b154270038' })
    })
  })

  test('DELETE participants/{Type}/{ID} request', ({ given, when, then }): void => {
    given('als-msisdn-oracle-svc server', async (): Promise<Server> => {
      server = await OracleServer.run(Config)
      return server
    })

    when(
      'an ALS requests a valid DELETE /participants/{Type}/{ID} request',
      async (): Promise<ServerInjectResponse> => {
        mockDeletePartyMapItem.mockResolvedValueOnce()
        const request = {
          method: 'DELETE',
          headers: Headers,
          url: '/participants/MSISDN/fb2f2b12-5107-48f1-a93d-52b154270038'
        }
        response = await server.inject(request)
        return response
      }
    )

    then('I respond with a 204 No Content', (): void => {
      expect(response.statusCode).toBe(204)
      expect(mockDeletePartyMapItem).toBeCalledWith('fb2f2b12-5107-48f1-a93d-52b154270038')
    })
  })
})
