/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the 2020-2025 Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Mojaloop Foundation

 * Vijay Kumar Guthi <vijaya.guthi@infitx.com>

 --------------
 ******/

/*
 * Tests for MySQL Timestamp field return type to Date object and
 * its value (including time zone) need to be implemented.
 * SQLite doesn't support native timestamp or typecasting and
 * returns ISO strings for timestamp field.
 * Thus, testing environment (SQLite) differs from Production environment.
 */

import { knex, Knex } from 'knex'
import Config, { DatabaseConfig } from '~/shared/config'
import OracleDB, { PartyMapItem, RETRIABLE_ERROR_CODES } from '~/model/MSISDN'
import { NotFoundError, RetriableDbError } from '~/model/errors'

Config.DATABASE.client = 'sqlite3'
Config.DATABASE.connection = ':memory:'
Config.DATABASE.useNullAsDefault = true
Config.DATABASE.migrations = {
  directory: Config.DATABASE.migrations.directory,
  stub: Config.DATABASE.migrations.stub,
  tableName: 'auth-service',
  loadExtensions: ['.ts']
}
Config.DATABASE.seeds = {
  directory: Config.DATABASE.migrations.directory,
  loadExtensions: ['.ts']
}

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

const examplePartyMapItemWithSubId: PartyMapItem = {
  id: '111111',
  fspId: 'dfspa',
  subId: 'HOME'
}

const updatedPartyMapItemWithSubId: PartyMapItem = {
  id: '111111',
  fspId: 'dfspb',
  subId: 'HOME'
}

const expectedPartyMapItemWithSubId: PartyMapItem = {
  id: '111111',
  fspId: 'dfspa',
  subId: 'HOME'
}

/*
 * PartyMapItem Resource Model Unit Tests
 */
describe('src/model/MSISDN', (): void => {
  let Db: Knex
  let oracleDB: OracleDB

  beforeAll(async (): Promise<void> => {
    Db = knex(Config.DATABASE as DatabaseConfig)
    await Db.migrate.latest()
    await Db.raw('PRAGMA foreign_keys = ON')

    oracleDB = new OracleDB(Db)
  })

  afterAll(async (): Promise<void> => {
    Db.destroy()
  })

  // Reset table for new test
  beforeEach(async (): Promise<void> => {
    await Db<PartyMapItem>('oracleMSISDN').del()
  })

  describe('insert', (): void => {
    it('adds entry to the database', async (): Promise<void> => {
      const inserted: boolean = await oracleDB.insert(examplePartyMapItem)

      expect(inserted).toEqual(true)

      const partyMapItems: PartyMapItem[] = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: examplePartyMapItem.id
      })

      expect(partyMapItems.length).toEqual(1)
      expect(partyMapItems[0]).toEqual(expectedPartyMapItem)
    })

    it('adds entry to the database with subId', async (): Promise<void> => {
      const inserted: boolean = await oracleDB.insert(examplePartyMapItemWithSubId)

      expect(inserted).toEqual(true)

      const partyMapItems: PartyMapItem[] = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: examplePartyMapItemWithSubId.id,
        subId: examplePartyMapItemWithSubId.subId
      })

      expect(partyMapItems.length).toEqual(1)
      expect(partyMapItems[0]).toEqual(expectedPartyMapItemWithSubId)
    })

    it('throws an error on adding a entry with existing Id', async (): Promise<void> => {
      const inserted: boolean = await oracleDB.insert(examplePartyMapItem)

      expect(inserted).toEqual(true)

      const partyMapItems: PartyMapItem[] = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: examplePartyMapItem.id
      })

      // Entry has been added
      expect(partyMapItems[0]).toEqual(expectedPartyMapItem)

      // Fail primary key constraint
      await expect(oracleDB.insert(examplePartyMapItem)).rejects.toThrow()
    })

    it('throws an error on adding entry without an id', async (): Promise<void> => {
      const entryWithoutId: PartyMapItem = {
        id: null as unknown as string,
        fspId: 'dfspa'
      }

      await expect(oracleDB.insert(entryWithoutId)).rejects.toThrow()
    })
  })

  describe('update', (): void => {
    it('updates existing entry from having only required fields', async (): Promise<void> => {
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

    it('updates existing entry with subId from having only required fields', async (): Promise<void> => {
      // Inserting record to update
      await Db<PartyMapItem>('oracleMSISDN').insert(examplePartyMapItemWithSubId)

      // Update only selected fields of inserted record
      const updateCount: number = await oracleDB.update(updatedPartyMapItemWithSubId)

      expect(updateCount).toEqual(1)

      const partyMapItems: PartyMapItem[] = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: updatedPartyMapItemWithSubId.id,
        subId: updatedPartyMapItemWithSubId.subId
      })

      expect(partyMapItems[0].id).toEqual(updatedPartyMapItemWithSubId.id)
      expect(partyMapItems[0]).toEqual(expect.objectContaining(updatedPartyMapItemWithSubId))
    })

    it('throws an error on updating non-existent entry', async (): Promise<void> => {
      await expect(oracleDB.update(updatedPartyMapItem)).rejects.toThrow(NotFoundError)
    })
  })

  describe('retrieve', (): void => {
    it('retrieves an existing entry', async (): Promise<void> => {
      await Db<PartyMapItem>('oracleMSISDN').insert(examplePartyMapItem)

      const partyMapItem: PartyMapItem = await oracleDB.retrieve(examplePartyMapItem.id)

      expect(partyMapItem).toEqual(expect.objectContaining(examplePartyMapItem))
    })

    it('retrieves an existing entry with subId', async (): Promise<void> => {
      await Db<PartyMapItem>('oracleMSISDN').insert(examplePartyMapItemWithSubId)

      const partyMapItem: PartyMapItem = await oracleDB.retrieve(
        examplePartyMapItemWithSubId.id,
        examplePartyMapItemWithSubId.subId
      )

      expect(partyMapItem).toEqual(expect.objectContaining(examplePartyMapItemWithSubId))
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

    it('deletes an existing entry with subId', async (): Promise<void> => {
      await Db<PartyMapItem>('oracleMSISDN').insert(examplePartyMapItemWithSubId)

      let partyMapItems: PartyMapItem[] = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: examplePartyMapItemWithSubId.id,
        subId: examplePartyMapItemWithSubId.subId
      })

      // Inserted properly
      expect(partyMapItems.length).toEqual(1)

      const deleteCount: number = await oracleDB.delete(
        examplePartyMapItemWithSubId.id,
        examplePartyMapItemWithSubId.subId
      )

      expect(deleteCount).toEqual(1)

      partyMapItems = await Db<PartyMapItem>('oracleMSISDN').select('*').where({
        id: examplePartyMapItemWithSubId.id,
        subId: examplePartyMapItemWithSubId.subId
      })

      // Deleted properly
      expect(partyMapItems.length).toEqual(0)
    })

    it('throws an error on deleting non-existent entry', async (): Promise<void> => {
      await expect(oracleDB.delete(examplePartyMapItem.id)).rejects.toThrow(NotFoundError)
    })
  })

  describe('handleError Tests', () => {
    it('should rethrow RetriableDbError', () => {
      const dbError = { code: RETRIABLE_ERROR_CODES[1] }
      const err = oracleDB['handleDbError']('msg', dbError)
      expect(err).toBeInstanceOf(RetriableDbError)
      expect((err as any).cause).toEqual(dbError)
    })

    it('should rethrow initial dbError', () => {
      const dbError = new Error('dbError')
      const err = oracleDB['handleDbError']('msg', dbError)
      expect(err).toEqual(dbError)
    })
  })
})
