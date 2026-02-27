import { oracleDB, closeKnexConnection } from '~/lib/db'
import { PartyMapItem } from '~/domain/types'

describe('oracleDB Tests -->', () => {
  afterAll(async () => {
    await closeKnexConnection()
  })

  test('should have oracleDB connected', async () => {
    const isOk = await oracleDB.isConnected()
    expect(isOk).toBe(true)
  })

  test('should insert several PartyMapItems', async () => {
    const data: PartyMapItem[] = [
      { id: '123', fspId: 'fsp1' },
      { id: '456', fspId: 'fsp2' }
    ]
    const created = await oracleDB.insert(data)
    expect(created).toBe(true)
  })

  test('should fail to insert existing items', async () => {
    const data: PartyMapItem[] = [
      { id: 'aaa', fspId: 'fsp1' },
      { id: 'aaa', fspId: 'fsp2' }
    ]
    await expect(() => oracleDB.insert(data)).rejects.toThrow()
  })
})
