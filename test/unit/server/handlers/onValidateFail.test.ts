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

 * Vijay Kumar Guthi <vijaya.guthi@infitx.com>

 --------------
 ******/
import Boom from '@hapi/boom'
import onValidateFail from '~/server/handlers/onValidateFail'
import { logger } from '~/shared/logger'

describe('server/handlers/onValidateFail', (): void => {
  it('should throw 404 error for Invalid request path', (): void => {
    const err = new Error('Invalid request path')
    expect(() => {
      onValidateFail(logger, err)
    }).toThrow(Boom.notFound('Unknown URI', { 
      errorInformation: { 
        errorCode: '3002', 
        errorDescription: 'Unknown URI' 
      } 
    }))
  })

  it('should throw 404 error for Missing required parameter', (): void => {
    const err = new Error('Missing required parameter')
    expect(() => {
      onValidateFail(logger, err)
    }).toThrow(Boom.notFound('Unknown URI', { 
      errorInformation: { 
        errorCode: '3002', 
        errorDescription: 'Unknown URI' 
      } 
    }))
  })

  it('should throw 404 error for Unknown route', (): void => {
    const err = new Error('Unknown route')
    expect(() => {
      onValidateFail(logger, err)
    }).toThrow(Boom.notFound('Unknown URI', { 
      errorInformation: { 
        errorCode: '3002', 
        errorDescription: 'Unknown URI' 
      } 
    }))
  })

  it('should throw 404 error for no route matches request', (): void => {
    const err = new Error('404-notFound: no route matches request')
    expect(() => {
      onValidateFail(logger, err)
    }).toThrow(Boom.notFound('Unknown URI', { 
      errorInformation: { 
        errorCode: '3002', 
        errorDescription: 'Unknown URI' 
      } 
    }))
  })

  it('should throw 400 error for other validation errors', (): void => {
    const err = new Error('Some other validation error')
    expect(() => {
      onValidateFail(logger, err)
    }).toThrow(Boom.badRequest('Some other validation error'))
  })

  it('should throw 400 error when no error is provided', (): void => {
    expect(() => {
      onValidateFail(logger)
    }).toThrow(Boom.badRequest('Validation Error'))
  })
})
