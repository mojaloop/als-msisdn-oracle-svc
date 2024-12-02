'use strict'

import { Schemas } from '@mojaloop/api-snippets/lib/fspiop/v1_1'
import { IOracleDb, ILogger } from '../domain/types'

declare module '@hapi/hapi' {
  // Hapi user-extensible type for application specific state
  interface ServerApplicationState {
    logger: ILogger
    oracleDB: IOracleDb
    // add other cross-app deps, if needed
  }
}

export interface ParticipantsTypeIDPostPutRequest {
  fspId: Schemas.FspId
  currency?: Schemas.Currency
  partySubIdOrType?: Schemas.PartySubIdOrType
}

export type PostParticipantsBulkRequest = {
  requestId: string
  partyList: PostParticipantsBulkItem[]
  currency?: Schemas.Currency
}

export type PostParticipantsBulkItem = {
  partyIdType: Schemas.PartyIdType
  partyIdentifier: Schemas.PartyIdentifier
  partySubIdOrType?: Schemas.PartySubIdOrType
  fspId?: Schemas.FspId
  extensionList?: Schemas.ExtensionList
}
