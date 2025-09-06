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
// istanbul ignore file

import { Enums } from '@mojaloop/central-services-error-handling'
import { ErrorInformation } from '~/interface/types'
import { MAX_ERROR_DESCRIPTION_LENGTH } from '~/constants'

type MlErrorCode = keyof typeof Enums.FSPIOPErrorCodes
type UnknownError = unknown
type ErrOptions = {
  cause?: UnknownError
} & Record<string, unknown>

export class CustomOracleError extends Error {
  public readonly statusCode: number = 500
  public readonly errorInformation: ErrorInformation = this.makeErrorInfo('SERVER_ERROR')
  public readonly name = this.constructor.name

  constructor(message: string, { cause }: ErrOptions = {}) {
    super(message, { cause })
    Error.captureStackTrace(this, this.constructor)
  }

  protected makeErrorInfo(mlErrCode: MlErrorCode, extraMessage: string = ''): ErrorInformation {
    const { code, message: description } = Enums.FSPIOPErrorCodes[mlErrCode] || {}

    if (!code) throw new Error('errorCode is required!')
    if (!description) throw new Error('errorDescription is required!')

    const finalDescription = extraMessage ? `${description} - ${extraMessage}` : description

    return {
      errorCode: code,
      errorDescription: truncateString(finalDescription)
      // add extensionList?
    }
  }
}

export class NotFoundError extends CustomOracleError {
  public readonly statusCode = 404
  public readonly errorInformation: ErrorInformation

  // todo: refactor to use message: string as 1st arg of ctor
  public constructor(resource: string, id: string) {
    super(`NotFoundError: ${resource} for MSISDN Id ${id}`)
    this.errorInformation = this.makeErrorInfo('ID_NOT_FOUND', `${resource} for MSISDN Id ${id} not found`)
  }
}

export class MalformedParameterError extends CustomOracleError {
  public readonly statusCode = 400
  public readonly errorInformation: ErrorInformation

  public constructor(message: string) {
    super(message)
    this.errorInformation = this.makeErrorInfo('MALFORMED_SYNTAX', message)
  }
}

export class MissingParameterError extends MalformedParameterError {}

export class IDTypeNotSupported extends CustomOracleError {
  public readonly statusCode = 400
  public readonly errorInformation: ErrorInformation

  public constructor(message: string = 'This service supports only MSISDN ID types') {
    super(message)
    this.errorInformation = this.makeErrorInfo('MALFORMED_SYNTAX', message)
  }
}

export class AddPartyInfoError extends CustomOracleError {
  public readonly statusCode: number = 400
  public readonly errorInformation: ErrorInformation

  public constructor(message: string) {
    super(message)
    this.errorInformation = this.makeErrorInfo('ADD_PARTY_INFO_ERROR', message)
  }
}

export class DuplicationPartyError extends AddPartyInfoError {
  public readonly statusCode = 409
}

export class RetriableDbError extends CustomOracleError {
  public readonly statusCode = 503
  public readonly errorInformation: ErrorInformation

  constructor(message: string, { cause }: ErrOptions = {}) {
    super(message, { cause })
    const extraMessage =
      cause instanceof Error ? `${message} [cause: ${'code' in cause ? cause.code : cause.message}]` : message
    this.errorInformation = this.makeErrorInfo('SERVICE_CURRENTLY_UNAVAILABLE', `[DB] ${extraMessage}`)
  }
}

export class InternalServerError extends CustomOracleError {
  public readonly statusCode = 500
  public readonly errorInformation: ErrorInformation

  constructor(message: string, { cause }: ErrOptions = {}) {
    super(message, { cause })
    const extraMessage = cause instanceof Error ? `${message}  [cause: ${cause.message}]` : message
    this.errorInformation = this.makeErrorInfo('INTERNAL_SERVER_ERROR', extraMessage)
  }
}

const LONG_DESCRIPTION_SUFFIX = '...'

/**
 * Truncates a string to fit within the specified maximum length
 * @param text - The string to truncate
 * @param maxLength - Maximum allowed length (default: 128)
 * @returns Truncated string with ellipsis if needed
 */
function truncateString(text: string, maxLength: number = MAX_ERROR_DESCRIPTION_LENGTH): string {
  return text.length <= maxLength
    ? text
    : text.substring(0, maxLength - LONG_DESCRIPTION_SUFFIX.length) + LONG_DESCRIPTION_SUFFIX
}
