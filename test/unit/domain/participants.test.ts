import { oracleDB } from '~/lib/db'

import { retrievePartyMapItem, createPartyMapItem, updatePartyMapItem, deletePartyMapItem } from '~/domain/participants'

import { logger } from '~/shared/logger'
import { PartyMapItem } from '~/model/MSISDN'

jest.mock('~/shared/logger')

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
