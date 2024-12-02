import { randomUUID } from 'node:crypto'
import { PostParticipantsBulkItem, PostParticipantsBulkRequest } from '~/interface/types'

/* prettier-ignore */
export const mockPostParticipantsBulkItem = ({
  partyIdType = 'MSISDN',
  partyIdentifier = `partyId-${Date.now()}`,
  partySubIdOrType = '',
  fspId = 'sourceFspId',
  extensionList
}: Partial<PostParticipantsBulkItem> = {}): PostParticipantsBulkItem => ({
  partyIdType,
  partyIdentifier,
  ...(partySubIdOrType && { partySubIdOrType }),
  ...(fspId && { fspId }),
  ...(extensionList && { extensionList })
}) as const

/* prettier-ignore */
export const mockPostParticipantsBulkRequest = ({
  requestId = randomUUID(),
  partyList = [mockPostParticipantsBulkItem()],
  currency = 'XXX'
}: Partial<PostParticipantsBulkRequest> = {}): PostParticipantsBulkRequest => ({
  requestId,
  partyList,
  ...(currency && { currency })
}) as const
