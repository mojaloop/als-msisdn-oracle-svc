import { knex, Knex } from 'knex'
import Config from '~/shared/config'

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
  let db: Knex

  beforeAll(async (): Promise<void> => {
    db = knex(Config.DATABASE as object)
    await db.seed.run()
  })

  afterAll(async (): Promise<void> => {
    db.destroy()
  })

  it('should properly select all the entries in the oracleMSISDN table', async (): Promise<void> => {
    expect(db).toBeDefined()
    const records: Knex.QueryBuilder[] = await db.from('oracleMSISDN').select('*')
    expect(records.length).toEqual(3)
    expect(records).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '000000',
          fspId: 'dfspa'
        })
      ])
    )
    expect(records).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '111111',
          fspId: 'dfspb'
        })
      ])
    )
    expect(records).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '222222',
          fspId: 'dfspc'
        })
      ])
    )
  })
})

describe('testing that constraints are enforced in the oracleMSISDN table', (): void => {
  let db: Knex

  beforeAll(async (): Promise<void> => {
    db = knex(Config.DATABASE as object)
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
