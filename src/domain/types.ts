import { Logger } from '@mojaloop/sdk-standard-components'

export type ILogger = Logger.Logger // add type alias for Logger

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
}
