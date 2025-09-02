import { ResponseValue } from '@hapi/hapi'
import {
  ErrorInformation,
  ParticipantsTypeIDGetResponse,
  ParticipantsTypeIDPostPutRequest,
  PartyTypeIdInfo,
  PostParticipantsBulkRequest,
  PostParticipantsBulkResponse
} from '~/interface/types'
import { Logger } from '@mojaloop/sdk-standard-components'

export type ILogger = Logger.SdkLogger // add type alias for Logger

export type IParticipantController = {
  handleBulkCreate(
    payload: PostParticipantsBulkRequest,
    source: string
  ): Promise<ControllerResponse<PostParticipantsBulkResponse>>
  handleGetPartyById(
    partyType: string,
    partyId: string,
    subId?: string
  ): Promise<ControllerResponse<ParticipantsTypeIDGetResponse>>
  handlePostParty(
    partyType: string,
    partyId: string,
    payload: ParticipantsTypeIDPostPutRequest,
    subId?: string
  ): Promise<ControllerResponse<undefined>>
  handlePutParty(
    partyType: string,
    partyId: string,
    payload: ParticipantsTypeIDPostPutRequest,
    subId?: string
  ): Promise<ControllerResponse<undefined>>
  handleDeleteParty(partyType: string, partyId: string, subId?: string): Promise<ControllerResponse<undefined>>
}

// todo: optimize this type declaration
export type ControllerResponse<T = ResponseValue> =
  | {
      result: T
      statusCode: number
    }
  | {
      result: ErrorResponse
      statusCode: number
    }

export type ErrorResponse = {
  errorInformation: ErrorInformation
}

export type IParticipantService = {
  bulkCreate(payload: PostParticipantsBulkRequest, source: string): Promise<PostParticipantsBulkResponse>
  createPartyMapItem(id: string, payload: ParticipantsTypeIDPostPutRequest, subId?: string): Promise<boolean>
  updateParty(id: string, partyDetails: ParticipantsTypeIDPostPutRequest, subId?: string): Promise<number>
  retrieveOneParty(id: string, subId?: string): Promise<PartyTypeIdInfo> // or null ?
  deleteParty(id: string, subId?: string): Promise<number>
}

export type ParticipantServiceDeps = {
  oracleDB: IOracleDb
  logger: ILogger
}

/*
 * Interface for PartyMapItem resource type
 */
export interface PartyMapItem {
  id: string
  subId?: string
  fspId: string
}

export type IOracleDb = {
  insert(item: PartyMapItem | Array<PartyMapItem>): Promise<boolean>
  update(partyMapItem: PartyMapItem): Promise<number>
  retrieve(id: string, subId?: string): Promise<PartyMapItem>
  delete(id: string, subId?: string): Promise<number>
  isConnected(): Promise<boolean>
  isDuplicationError(error: unknown): boolean
  isRetriableError(error: unknown): boolean
}
