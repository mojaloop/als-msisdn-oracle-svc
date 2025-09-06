export const ERROR_MESSAGES = {
  noPartyFspId: 'Each partyItem should have fspId',
  unsupportedPartyIdType: 'This service supports only MSISDN ID types'
} as const

export const MAX_ERROR_DESCRIPTION_LENGTH = 128 // according to OpenAPI schema of ErrorInformation
