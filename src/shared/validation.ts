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

import { ResponseToolkit, ResponseObject } from '@hapi/hapi'
import { IDTypeNotSupported, MalformedParameterError } from '~/model/errors'

/**
 * Validates that the Type parameter is MSISDN
 * @param type - The Type parameter from the request
 * @param h - Hapi response toolkit
 * @returns Error response if invalid, undefined if valid
 */
export function validateTypeIsMSISDN(type: string, h: ResponseToolkit): ResponseObject | undefined {
  if (type !== 'MSISDN') {
    const error = new IDTypeNotSupported()
    return h.response(error.errorInformation).code(error.statusCode)
  }
  return undefined
}

/**
 * Validates that a parameter is not empty or a placeholder value
 * @param paramName - Name of the parameter (e.g., 'ID', 'SubId')
 * @param paramValue - The parameter value to validate
 * @param h - Hapi response toolkit
 * @returns Error response if invalid, undefined if valid
 */
export function validateParameter(
  paramName: string,
  paramValue: string | undefined,
  h: ResponseToolkit
): ResponseObject | undefined {
  // Check if parameter is missing or empty
  if (!paramValue) {
    return h
      .response({
        errorInformation: {
          errorCode: '3002',
          errorDescription: `Unknown URI - ${paramName} parameter is missing`
        }
      })
      .code(404)
  }

  // Check if parameter is a placeholder value
  if (paramValue === `{${paramName}}` || paramValue.includes('{') || paramValue.includes('}')) {
    const error = new MalformedParameterError(paramName, paramValue)
    return h.response(error.errorInformation).code(error.statusCode)
  }

  return undefined
}

/**
 * Validates both Type and ID parameters for participant endpoints
 * @param type - The Type parameter from the request
 * @param id - The ID parameter from the request
 * @param h - Hapi response toolkit
 * @returns Error response if invalid, undefined if valid
 */
export function validateParticipantParams(
  type: string,
  id: string | undefined,
  h: ResponseToolkit
): ResponseObject | undefined {
  // First validate Type
  const typeError = validateTypeIsMSISDN(type, h)
  if (typeError) return typeError

  // Then validate ID
  const idError = validateParameter('ID', id, h)
  if (idError) return idError

  return undefined
}

/**
 * Validates Type, ID, and SubId parameters for participant sub-resource endpoints
 * @param type - The Type parameter from the request
 * @param id - The ID parameter from the request
 * @param subId - The SubId parameter from the request
 * @param h - Hapi response toolkit
 * @returns Error response if invalid, undefined if valid
 */
export function validateParticipantSubIdParams(
  type: string,
  id: string | undefined,
  subId: string | undefined,
  h: ResponseToolkit
): ResponseObject | undefined {
  // First validate Type and ID
  const baseError = validateParticipantParams(type, id, h)
  if (baseError) return baseError

  // Then validate SubId
  const subIdError = validateParameter('SubId', subId, h)
  if (subIdError) return subIdError

  return undefined
}
