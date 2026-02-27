import { oracleDB } from '~/lib/db'

import { retrievePartyMapItem, createPartyMapItem, updatePartyMapItem, deletePartyMapItem } from '~/domain/participants'

import { logger } from '~/shared/logger'
import { PartyMapItem } from '~/model/MSISDN'

// Declare Mocks
const mockInsertPartyMapItem = jest.spyOn(oracleDB, 'insert')
const mockUpdatePartyMapItem = jest.spyOn(oracleDB, 'update')
const mockRetrievePartyMapItem = jest.spyOn(oracleDB, 'retrieve')
const mockDeletePartyMapItem = jest.spyOn(oracleDB, 'delete')
const mockPartyMapItem: PartyMapItem = {
  id: '987654321',
  fspId: 'dfspa'
}

describe('server/domain/participants', (): void => {
  beforeAll((): void => {
    mockInsertPartyMapItem.mockResolvedValue(true)
    mockUpdatePartyMapItem.mockResolvedValue(1)
    mockDeletePartyMapItem.mockResolvedValue(1)
    mockRetrievePartyMapItem.mockResolvedValue(mockPartyMapItem)
  })

  it('test logger', (): void => {
    expect(logger).toBeDefined()
    expect(logger.push({})).toBeDefined()
  })

  it('createPartyMapItem should resolve successfully', async (): Promise<void> => {
    await expect(createPartyMapItem(mockPartyMapItem)).resolves.toBe(undefined)
    expect(mockInsertPartyMapItem).toHaveBeenCalledWith(mockPartyMapItem)
  })

  it('should fail to create existing party with statusCode 400', async (): Promise<void> => {
    mockInsertPartyMapItem.mockRejectedValueOnce({ code: 'ER_DUP_ENTRY' })
    const errResult = await createPartyMapItem(mockPartyMapItem)
    expect(errResult?.statusCode).toBe(400)
    expect(errResult?.errorInformation.errorCode).toBe('3003')
  })

  it('should return statusCode 500 in case of any other DB errors', async (): Promise<void> => {
    mockInsertPartyMapItem.mockRejectedValueOnce(new Error('DB error'))
    const errResult = await createPartyMapItem(mockPartyMapItem)
    expect(errResult?.statusCode).toBe(500)
    expect(errResult?.errorInformation.errorCode).toBe('3003')
  })

  it('retrievePartyMapItem should resolve successfully', async (): Promise<void> => {
    await expect(retrievePartyMapItem(mockPartyMapItem.id)).resolves.toBe(mockPartyMapItem)
    expect(mockRetrievePartyMapItem).toHaveBeenCalledWith(mockPartyMapItem.id, undefined)
  })

  it('updatePartyMapItem should resolve successfully', async (): Promise<void> => {
    await expect(updatePartyMapItem(mockPartyMapItem)).resolves.toBe(undefined)

    expect(mockUpdatePartyMapItem).toHaveBeenCalledWith(mockPartyMapItem)
  })

  it('deletePartyMapItem should resolve successfully', async (): Promise<void> => {
    await expect(deletePartyMapItem(mockPartyMapItem.id)).resolves.toBe(undefined)

    expect(mockDeletePartyMapItem).toHaveBeenCalledWith(mockPartyMapItem.id, undefined)
  })
})
