import { ParticipantController } from '~/domain/ParticipantController'
import { createParticipantController } from '~/domain/createParticipantController'
import { IOracleDb } from '~/domain/types'
import { RETRIABLE_ERROR_CODES } from '~/model/MSISDN'
import { logger } from '~/shared/logger'
import { createMockOracleDb } from 'test/unit/__mocks__/util'
import * as fixtures from 'test/fixtures'

describe('ParticipantController Tests -->', () => {
  let oracleDB: IOracleDb

  beforeEach(() => {
    oracleDB = createMockOracleDb()
  })

  it('should create ParticipantController instance', () => {
    const ctrl = createParticipantController({ oracleDB, logger })
    expect(ctrl).toBeInstanceOf(ParticipantController)
  })

  describe('handleBulkCreate Tests', () => {
    it('should return 201 error code in case of retriable DB error', async () => {
      oracleDB.insert = jest.fn().mockRejectedValue({ code: RETRIABLE_ERROR_CODES[1] })
      const ctrl = createParticipantController({ oracleDB, logger })
      const { statusCode } = await ctrl.handleBulkCreate(fixtures.mockPostParticipantsBulkRequest(), 'source')
      expect(statusCode).toBe(201)
    })
  })
})
