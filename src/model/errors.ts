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

import { Enums } from '@mojaloop/central-services-error-handling';
import { ErrorInformation } from '~/interface/types';

type MlErrorCode = keyof typeof Enums.FSPIOPErrorCodes;
type UnknownError = unknown;

export class CustomOracleError extends Error {
  public readonly statusCode: number = 500;
  public readonly errorInformation: ErrorInformation = this.makeErrorInfo('SERVER_ERROR');
  public readonly name = this.constructor.name;

  constructor(message: string, { cause }: { cause?: UnknownError } = {}) {
    super(message, { cause });
    Error.captureStackTrace(this, this.constructor);
  }

  protected makeErrorInfo(mlErrCode: MlErrorCode): ErrorInformation {
    const { code: errorCode, message: errorDescription } = Enums.FSPIOPErrorCodes[mlErrCode] || {};

    if (!errorCode) throw new Error('errorCode is required!');
    if (!errorDescription) throw new Error('errorDescription is required!');

    return {
      errorCode,
      errorDescription
      // add extensionList?
    };
  }
}

export class NotFoundError extends CustomOracleError {
  public readonly statusCode = 404;
  public readonly errorInformation = this.makeErrorInfo('ID_NOT_FOUND');

  public constructor(resource: string, id: string) {
    super(`NotFoundError: ${resource} for MSISDN Id ${id}`);
    this.errorInformation.errorDescription += ` - ${resource} for MSISDN Id ${id} not found`;
  }
}

export class MalformedParameterError extends CustomOracleError {
  public readonly statusCode = 400;
  public readonly errorInformation = this.makeErrorInfo('MALFORMED_SYNTAX');

  public constructor(message: string) {
    super(message);
    this.errorInformation.errorDescription += ` - ${message}`;
  }
}

export class MissingParameterError extends MalformedParameterError {}

export class IDTypeNotSupported extends CustomOracleError {
  public readonly statusCode = 400;
  public readonly errorInformation = this.makeErrorInfo('MALFORMED_SYNTAX');

  public constructor(message: string = 'This service supports only MSISDN ID types') {
    super(message);
    this.errorInformation.errorDescription += ` - ${message}`;
  }
}

export class AddPartyInfoError extends CustomOracleError {
  public readonly statusCode = 400;
  public readonly errorInformation = this.makeErrorInfo('ADD_PARTY_INFO_ERROR');

  public constructor(message: string) {
    super(message);
    this.errorInformation.errorDescription += ` - ${message}`;
  }
}

export class DuplicationPartyError extends AddPartyInfoError {}

export class RetriableDbError extends CustomOracleError {
  public readonly statusCode = 503;
  public readonly errorInformation = this.makeErrorInfo('SERVICE_CURRENTLY_UNAVAILABLE');

  constructor(message: string, cause?: UnknownError) {
    super(message, { cause });
    if (cause instanceof Error) {
      this.errorInformation.errorDescription += ` - ${'code' in cause ? cause.code : cause.message}`;
    }
  }
}

export class InternalServerError extends CustomOracleError {
  public readonly statusCode = 500;
  public readonly errorInformation = this.makeErrorInfo('INTERNAL_SERVER_ERROR');

  constructor(message: string, cause?: UnknownError) {
    super(message, { cause });
    if (cause instanceof Error) {
      this.errorInformation.errorDescription += ` - ${message} [cause: ${cause?.message}]}`;
    }
  }
}
