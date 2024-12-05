/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 * Eugen Klymniuk <eugen.klymniuk@infitx.com>
 --------------
 **********/

import { randomUUID } from 'node:crypto'
import { ParticipantService } from '~/domain/ParticipantService'
import { IOracleDb, PartyMapItem } from '~/domain/types'
import { logger } from '~/shared/logger'

import { createMockOracleDb } from '../__mocks__/util'
import * as fixtures from '../../fixtures'

const isSinglePartyItem = (data: PartyMapItem | PartyMapItem[]): PartyMapItem => {
  if (!Array.isArray(data)) return data as PartyMapItem
  else throw new TypeError('Not a PartyItem')
}

describe('ParticipantService Tests -->', () => {
  let service: ParticipantService
  let oracleDB: IOracleDb

  beforeEach(() => {
    oracleDB = createMockOracleDb()
    service = new ParticipantService({ logger, oracleDB })
  })

  describe('bulkCreate method Tests', () => {
    test('should add errorInformation if any of parties have wrong partyIdType', async () => {
      const partyList = [fixtures.mockPartyIdInfo({ partyIdType: 'EMAIL' })]
      const payload = fixtures.mockPostParticipantsBulkRequest({ partyList })
      const result = await service.bulkCreate(payload, 'source')
      expect(result.partyList[0].errorInformation).toBeDefined()
      expect(result.partyList[0].partyId).toEqual(partyList[0])
    })

    test('should add errorInformation if fspId is not set, and no source-header', async () => {
      const partyList = [fixtures.mockPartyIdInfo({ fspId: '' })]
      const payload = fixtures.mockPostParticipantsBulkRequest({ partyList })
      const result = await service.bulkCreate(payload, '')
      expect(result.partyList[0].errorInformation).toBeDefined()
    })

    test('should create a party with empty subId', async () => {
      const payload = fixtures.mockPostParticipantsBulkRequest()
      const result = await service.bulkCreate(payload, 'sourceFsp')

      expect(result.partyList[0].errorInformation).toBeUndefined()
      expect(result.partyList[0].partyId).toEqual(payload.partyList[0])
      expect(oracleDB.insert).toHaveBeenCalledTimes(1)

      const args = (oracleDB as jest.Mocked<IOracleDb>).insert.mock.calls[0][0]
      const item = isSinglePartyItem(args)
      expect(item.id).toBe(payload.partyList[0].partyIdentifier)
      expect(item.fspId).toBe(payload.partyList[0].fspId)
      expect(item.subId).toBe('')
    })

    test('should create a party, and use source-header as fspId if it is not in a payload', async () => {
      const partyList = [fixtures.mockPartyIdInfo({ fspId: '' })]
      const payload = fixtures.mockPostParticipantsBulkRequest({ partyList })
      const source = `source-${randomUUID()}`

      await service.bulkCreate(payload, source)
      expect(oracleDB.insert).toHaveBeenCalledTimes(1)
      const args = (oracleDB as jest.Mocked<IOracleDb>).insert.mock.calls[0][0]
      const item = isSinglePartyItem(args)
      expect(item.fspId).toBe(source)
    })
  })
})
