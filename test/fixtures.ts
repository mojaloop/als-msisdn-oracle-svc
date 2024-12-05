import { randomUUID } from 'node:crypto'
import { PartyIdInfo, PostParticipantsBulkRequest } from '~/interface/types'

/* prettier-ignore */
export const mockPartyIdInfo = ({
  partyIdType = 'MSISDN',
  partyIdentifier = `partyId-${Date.now()}`,
  partySubIdOrType = '',
  fspId = 'sourceFspId',
  extensionList
}: Partial<PartyIdInfo> = {}): PartyIdInfo => ({
  partyIdType,
  partyIdentifier,
  ...(partySubIdOrType && { partySubIdOrType }),
  ...(fspId && { fspId }),
  ...(extensionList && { extensionList })
}) as const

/* prettier-ignore */
export const mockPostParticipantsBulkRequest = ({
  requestId = randomUUID(),
  partyList = [mockPartyIdInfo()],
  currency = 'XXX'
}: Partial<PostParticipantsBulkRequest> = {}): PostParticipantsBulkRequest => ({
  requestId,
  partyList,
  ...(currency && { currency })
}) as const
