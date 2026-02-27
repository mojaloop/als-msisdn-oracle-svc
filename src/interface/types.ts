'use strict'

import { Schemas } from '@mojaloop/api-snippets/lib/fspiop/v1_1'
import { IOracleDb, ILogger } from '../domain/types'

declare module '@hapi/hapi' {
  // Hapi user-extensible type for application-specific state
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

export type PostParticipantsBulkRequest = Schemas.ParticipantsPostRequest
export type PostParticipantsBulkResponse = Schemas.ParticipantsIDPutResponse
export type PartyIdInfo = Schemas.PartyIdInfo
export type PartyResult = Schemas.PartyResult

export type ErrorInformation = Schemas.ErrorInformation

// check why we don't have it in Schemas
export interface ParticipantsTypeIDPostPutRequest {
  fspId: Schemas.FspId
  currency?: Schemas.Currency
  partySubIdOrType?: Schemas.PartySubIdOrType
}
export type PartyTypeIdInfo = {
  fspId: string
  partySubIdOrType?: string
}
export type ParticipantsTypeIDGetResponse = {
  partyList: PartyTypeIdInfo[]
}
