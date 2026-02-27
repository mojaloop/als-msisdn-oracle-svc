import { knex, Knex } from 'knex'
import Config from '~/shared/config'
import OracleDB, { PartyMapItem } from '../../../src/model/MSISDN'
import { NotFoundError } from '../../../src/model/errors'

/*
 * Mock PartyMapItem Resources
 */
const examplePartyMapItem: PartyMapItem = {
  id: '000000',
  fspId: 'dfspa'
}

const expectedPartyMapItem: PartyMapItem = {
  id: '000000',
  fspId: 'dfspa',
  subId: ''
}

const updatedPartyMapItem: PartyMapItem = {
  id: '000000',
  fspId: 'dfspb'
}

/*
 * PartyMapItem Resource Model Integration Tests
 */
describe('src/model/MSISDN', (): void => {
  let Db: Knex
  let oracleDB: OracleDB

  beforeAll(async (): Promise<void> => {
    Db = knex(Config.DATABASE as object)

    oracleDB = new OracleDB(Db)
    await Db.seed.run()
  })

  afterAll(async (): Promise<void> => {
    Db.destroy()
  })

  // Reset table for new test
  beforeEach(async (): Promise<void> => {
    await Db<PartyMapItem>('oracleMSISDN').del()
  })

  describe('insert', (): void => {
    it('adds MSISDN map to the database', async (): Promise<void> => {
      const inserted: boolean = await oracleDB.insert(examplePartyMapItem)

      expect(inserted).toEqual(true)

      const partyMapItems: PartyMapItem[] = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: examplePartyMapItem.id
      })

      expect(partyMapItems.length).toEqual(1)
      expect(partyMapItems[0]).toEqual(expectedPartyMapItem)
    })

    it('throws an error on adding an item with existing Id', async (): Promise<void> => {
      const inserted: boolean = await oracleDB.insert(examplePartyMapItem)

      expect(inserted).toEqual(true)

      const partyMapItems: PartyMapItem[] = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: examplePartyMapItem.id
      })

      // PartyMapItem has been added
      expect(partyMapItems[0]).toEqual(expectedPartyMapItem)

      // Fail primary key constraint
      await expect(oracleDB.insert(examplePartyMapItem)).rejects.toThrow()
    })

    it('throws an error on adding an entry without an id', async (): Promise<void> => {
      const entryWithoutId: PartyMapItem = {
        id: null as unknown as string,
        fspId: 'dfspa'
      }

      await expect(oracleDB.insert(entryWithoutId)).rejects.toThrow()
    })
  })

  describe('update', (): void => {
    it('updates existing entry from a PartyMapItem having only required fields', async (): Promise<void> => {
      // Inserting record to update
      await Db<PartyMapItem>('oracleMSISDN').insert(examplePartyMapItem)

      // Update only selected fields of inserted record
      const updateCount: number = await oracleDB.update(updatedPartyMapItem)

      expect(updateCount).toEqual(1)

      const partyMapItems: PartyMapItem[] = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: updatedPartyMapItem.id
      })

      expect(partyMapItems[0].id).toEqual(updatedPartyMapItem.id)
      expect(partyMapItems[0]).toEqual(expect.objectContaining(updatedPartyMapItem))
    })

    it('throws an error on updating non-existent entry', async (): Promise<void> => {
      await expect(oracleDB.update(updatedPartyMapItem)).rejects.toThrow(NotFoundError)
    })
  })

  describe('retrieve', (): void => {
    it('retrieves an existing entry', async (): Promise<void> => {
      await Db<PartyMapItem>('oracleMSISDN').insert(examplePartyMapItem)

      const item: PartyMapItem = await oracleDB.retrieve(examplePartyMapItem.id)

      expect(item).toEqual(expect.objectContaining(examplePartyMapItem))
    })

    it('throws an error on retrieving non-existent entry', async (): Promise<void> => {
      await expect(oracleDB.retrieve(examplePartyMapItem.id)).rejects.toThrow(NotFoundError)
    })
  })

  describe('delete', (): void => {
    it('deletes an existing entry', async (): Promise<void> => {
      await Db<PartyMapItem>('oracleMSISDN').insert(examplePartyMapItem)

      let partyMapItems: PartyMapItem[] = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: examplePartyMapItem.id
      })

      // Inserted properly
      expect(partyMapItems.length).toEqual(1)

      const deleteCount: number = await oracleDB.delete(examplePartyMapItem.id)

      expect(deleteCount).toEqual(1)

      partyMapItems = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: examplePartyMapItem.id
      })

      // Deleted properly
      expect(partyMapItems.length).toEqual(0)
    })

    it('throws an error on deleting non-existent entry', async (): Promise<void> => {
      await expect(oracleDB.delete(examplePartyMapItem.id)).rejects.toThrow(NotFoundError)
    })
  })
})
