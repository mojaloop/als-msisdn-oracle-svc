import { Enums } from '@mojaloop/central-services-error-handling';
import { ErrorInformation } from '~/interface/types';

export type ErrorResponse = {
  statusCode: number;
  errorInformation: ErrorInformation;
};

type MlErrorCode = keyof typeof Enums.FSPIOPErrorCodes;

// prettier-ignore
export const baseErrorResponseDto = (
  statusCode = 500, errorKey: MlErrorCode = 'INTERNAL_SERVER_ERROR'
): ErrorResponse => {
  const { code, message } = Enums.FSPIOPErrorCodes[errorKey];

  return {
    statusCode,
    errorInformation: {
      errorCode: code,
      errorDescription: message
    }
  };
};

// prettier-ignore
export const addPartyErrorResponseDto = (statusCode: number) =>
  baseErrorResponseDto(statusCode, 'ADD_PARTY_INFO_ERROR');
