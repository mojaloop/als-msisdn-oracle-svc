import { Enums } from '@mojaloop/central-services-error-handling'
import { ErrorInformation, ParticipantsTypeIDPostPutRequest } from '~/interface/types'
import { PartyMapItem } from '~/domain/types'

export const partyMapItemDto = (
  partyId: string,
  partyDetails: ParticipantsTypeIDPostPutRequest,
  subId?: string
): PartyMapItem => ({
  id: partyId,
  fspId: partyDetails.fspId,
  subId: subId || partyDetails.partySubIdOrType
  // todo: clarify which subId to use in case of POST-PUT /participants/{Type}/{ID}/{SubId} - from params or from body?
})

// compare with ControllerResponse<T = ResponseValue> type
export type ErrorResponse = {
  statusCode: number
  errorInformation: ErrorInformation
}

type MlErrorCode = keyof typeof Enums.FSPIOPErrorCodes

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

// export const errorResponseDto = (
//   errorCode: string, errorDescription: string
// ): ErrorResponse => ({
//   errorInformation: {
//     errorCode,
//     errorDescription
//   }
// })
