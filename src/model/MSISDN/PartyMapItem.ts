import { NotFoundError } from '../errors'
import { Knex } from 'knex'

/*
 * Interface for PartyMapItem resource type
 */
export interface PartyMapItem {
  id: string
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
      const partyMapItems: PartyMapItem[] = await trx<PartyMapItem>('oracleMSISDN').select('*').where({ id: partyMapItem.id }).limit(1)

      if (partyMapItems.length === 0) {
        throw new NotFoundError('oracleMSISDN', partyMapItem.id)
      }

      const existingItem: PartyMapItem = partyMapItems[0]
      const updatedItem: Record<string, string | Date> = {}

      // Prepare a new Item with only allowable updates
      Object.keys(existingItem).forEach((key): void => {
        updatedItem[key] = partyMapItem[key as keyof PartyMapItem] as string | Date
      })

      return trx<PartyMapItem>('oracleMSISDN').where({ id: partyMapItem.id }).update(updatedItem)
    })
  }

  // Retrieve PartyMapItem by ID (unique)
  public async retrieve(id: string): Promise<PartyMapItem> {
    // Returns array containing PartyMapItems
    const partyMapItems: PartyMapItem[] = await this.Db<PartyMapItem>('oracleMSISDN').select('*').where({ id: id }).limit(1)

    if (partyMapItems.length === 0) {
      throw new NotFoundError('oracleMSISDN', id)
    }

    return partyMapItems[0]
  }

  // Delete PartyMapItem by ID
  // Deleting PartyMapItem automatically deletes associates scopes
  public async delete(id: string): Promise<number> {
    // Returns number of deleted rows
    const deleteCount: number = await this.Db<PartyMapItem>('oracleMSISDN').where({ id: id }).del()

    if (deleteCount === 0) {
      throw new NotFoundError('oracleMSISDN', id)
    }

    return deleteCount
  }
}
