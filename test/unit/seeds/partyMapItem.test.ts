import Config, { DatabaseConfig } from '~/shared/config'
import { knex, Knex } from 'knex'

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
  directory: Config.DATABASE.seeds.directory,
  loadExtensions: ['.ts']
}

describe('testing oracleMSISDN table', (): void => {
  let db: Knex<unknown[]>

  beforeAll(async (): Promise<void> => {
    db = knex(Config.DATABASE as DatabaseConfig)
    await db.migrate.latest()
    await db.seed.run()
  })

  afterAll(async (): Promise<void> => {
    db.destroy()
  })

  it('should properly select all the entries in the oracleMSISDN table', async (): Promise<void> => {
    expect(db).toBeDefined()
    const records: Knex.QueryBuilder[] = await db.from('oracleMSISDN').select('*')
    expect(records.length).toEqual(3)
    expect(records[0]).toMatchObject({
      id: '000000',
      fspId: 'dfspa'
    })
    expect(records[1]).toMatchObject({
      id: '111111',
      fspId: 'dfspb'
    })
    expect(records[2]).toMatchObject({
      id: '222222',
      fspId: 'dfspc'
    })
  })
})

describe('testing that constraints are enforced in the oracleMSISDN table', (): void => {
  let db: Knex<unknown[]>

  beforeAll(async (): Promise<void> => {
    db = knex(Config.DATABASE as DatabaseConfig)
    await db.migrate.latest()
    await db.seed.run()
  })

  afterAll(async (): Promise<void> => {
    db.destroy()
  })

  it('should properly enforce the primary key constraint in the oracleMSISDN table', async (): Promise<void> => {
    expect(db).toBeDefined()
    /* Tests for duplication */
    await expect(
      db.from('oracleMSISDN').insert({
        id: '000000',
        fspId: 'dfspa'
      })
    ).rejects.toThrow()
    /* Tests for non-nullity */
    await expect(
      db.from('oracleMSISDN').insert({
        id: null,
        fspId: 'dfspa'
      })
    ).rejects.toThrow()
  })
  it('should properly enforce the non-nullable constraint for fspId', async (): Promise<void> => {
    expect(db).toBeDefined()
    await expect(
      db.from('oracleMSISDN').insert({
        id: '000000',
        fspId: null
      })
    ).rejects.toThrow()
  })
})
