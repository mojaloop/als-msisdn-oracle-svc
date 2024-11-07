import { oracleDB } from '~/lib/db'
import { PartyMapItem } from '~/model/MSISDN'

export async function retrievePartyMapItem(id: string): Promise<PartyMapItem> {
  const item: PartyMapItem = await oracleDB.retrieve(id)
  return item
}

export async function createPartyMapItem(item: PartyMapItem): Promise<void> {
  await oracleDB.insert(item)
}

export async function updatePartyMapItem(item: PartyMapItem): Promise<void> {
  await oracleDB.update(item)
}

export async function deletePartyMapItem(id: string): Promise<void> {
  await oracleDB.delete(id)
}
