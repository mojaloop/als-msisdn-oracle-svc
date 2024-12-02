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

import Boom from '@hapi/boom'
import { PostParticipantsBulkRequest } from '../interface/types'
import { ParticipantServiceDeps, PartyMapItem } from './types'
import { ERROR_MESSAGES } from '~/constants'
import { IDTypeNotSupported } from '~/model/errors'

export class ParticipantService {
  constructor(private readonly deps: ParticipantServiceDeps) {}

  async bulkCreate(payload: PostParticipantsBulkRequest, source: string): Promise<boolean> {
    const { logger, oracleDB } = this.deps
    try {
      const partyItems: PartyMapItem[] = this.mapPayloadToPartyItems(payload, source)
      const result = await oracleDB.insert(partyItems)
      logger.push({ result, partyItems }).verbose('bulkCreate is done')
      return true
    } catch (err: unknown) {
      logger.push({ err }).error('error in bulkCreate')
      throw err
    }
  }

  mapPayloadToPartyItems(payload: PostParticipantsBulkRequest, source: string): PartyMapItem[] {
    const { logger } = this.deps

    return payload.partyList.map((party) => {
      if (party.partyIdType !== 'MSISDN') {
        const err = new IDTypeNotSupported()
        logger.push({ party, err }).warn(err.message)
        throw Boom.badRequest(err)
      }

      const item: PartyMapItem = {
        id: party.partyIdentifier,
        subId: party.partySubIdOrType || '',
        fspId: party.fspId || source
      }
      if (!item.fspId) {
        const errMessage = ERROR_MESSAGES.noPartyFspId
        logger.push({ item }).warn(errMessage)
        throw Boom.badRequest(errMessage)
      }

      return item
    })
  }

  // todo: move all methods from  /.participants here
}
