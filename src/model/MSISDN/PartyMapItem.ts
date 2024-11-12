import { NotFoundError } from '../errors'
import { Knex } from 'knex'

/*
 * Interface for PartyMapItem resource type
 */
export interface PartyMapItem {
  id: string
  subId?: string
  fspId: string
}

/*
 * Class to abstract PartyMapItem DB operations
 */
export class OracleDB {
  // Knex instance
  private Db: Knex

  public constructor(dbInstance: Knex) {
    this.Db = dbInstance
  }

  // Add initial PartyMapItem parameters
  // Error bubbles up in case of primary key violation
  public async insert(item: PartyMapItem | Array<PartyMapItem>): Promise<boolean> {
    // Returns [0] for MySQL-Knex and [Row Count] for SQLite-Knex
    await this.Db<PartyMapItem>('oracleMSISDN').insert(item)

    return true
  }

  // Update PartyMapItem
  public async update(partyMapItem: PartyMapItem): Promise<number> {
    // Returns number of updated rows
    // Transaction to make the update atomic
    return this.Db.transaction(async (trx): Promise<number> => {
      // Transaction is rolled back automatically if there is
      // an error and the returned promise is rejected
      let selectQuery = trx<PartyMapItem>('oracleMSISDN').select('*').where({ id: partyMapItem.id }).limit(1)

      if (partyMapItem.subId !== undefined) {
        selectQuery = selectQuery.andWhere('subId', partyMapItem.subId)
      }
      const partyMapItems: PartyMapItem[] = await selectQuery

      if (partyMapItems.length === 0) {
        throw new NotFoundError('oracleMSISDN', partyMapItem.id)
      }

      const existingItem: PartyMapItem = partyMapItems[0]
      const updatedItem: Record<string, string | Date> = {}

      // Prepare a new Item with only allowable updates
      Object.keys(existingItem).forEach((key): void => {
        updatedItem[key] = partyMapItem[key as keyof PartyMapItem] as string | Date
      })

      let updateQuery = trx<PartyMapItem>('oracleMSISDN').where({ id: partyMapItem.id }).update(updatedItem)

      if (partyMapItem.subId !== undefined) {
        updateQuery = updateQuery.andWhere('subId', partyMapItem.subId)
      }

      return updateQuery
    })
  }

  // Retrieve PartyMapItem by ID and subId (unique)
  // Incase of multiple rows, return the first one
  public async retrieve(id: string, subId?: string): Promise<PartyMapItem> {
    // Returns array containing PartyMapItems
    let query = this.Db<PartyMapItem>('oracleMSISDN').select('*').where('id', id).limit(1)

    if (subId !== undefined) {
      query = query.andWhere('subId', subId)
    }
    const partyMapItems: PartyMapItem[] = await query

    if (partyMapItems.length === 0) {
      throw new NotFoundError('oracleMSISDN', id)
    }
    const returnItem: PartyMapItem = partyMapItems[0]
    if (returnItem.subId === '') {
      delete returnItem.subId
    }

    return returnItem
  }

  // Delete PartyMapItem by ID
  // Deleting PartyMapItem automatically deletes associates scopes
  public async delete(id: string, subId?: string): Promise<number> {
    // Returns number of deleted rows
    let deleteQuery = this.Db<PartyMapItem>('oracleMSISDN').where({ id: id }).del()

    if (subId !== undefined) {
      deleteQuery = deleteQuery.andWhere('subId', subId)
    }
    const deleteCount: number = await deleteQuery

    if (deleteCount === 0) {
      throw new NotFoundError('oracleMSISDN', id)
    }

    return deleteCount
  }
}
