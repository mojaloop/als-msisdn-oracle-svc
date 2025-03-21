import { oracleDB } from '~/lib/db'
import { PartyMapItem } from '~/model/MSISDN'
import { logger } from '~/shared/logger'
import * as dto from '~/shared/dto'

export async function retrievePartyMapItem(id: string, subId?: string): Promise<PartyMapItem> {
  const item: PartyMapItem = await oracleDB.retrieve(id, subId)
  return item
}

export async function createPartyMapItem(item: PartyMapItem): Promise<undefined | dto.ErrorResponse> {
  try {
    await oracleDB.insert(item)
    return
  } catch (err: unknown) {
    const isDuplication = oracleDB.isDuplicationError(err)
    logger[isDuplication ? 'warn' : 'error']('error in createPartyMapItem', err)
    return dto.addPartyErrorResponseDto(isDuplication ? 400 : 500)
  }
}

export async function updatePartyMapItem(item: PartyMapItem): Promise<void> {
  await oracleDB.update(item)
}

export async function deletePartyMapItem(id: string, subId?: string): Promise<void> {
  await oracleDB.delete(id, subId)
}
