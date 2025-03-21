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

import { Enums } from '@mojaloop/central-services-error-handling'
import {
  PartyIdInfo,
  PostParticipantsBulkRequest,
  PostParticipantsBulkResponse,
  PartyResult,
  ErrorInformation
} from '../interface/types'
import { ParticipantServiceDeps, PartyMapItem, ILogger } from './types'
import { ERROR_MESSAGES } from '~/constants'

export class ParticipantService {
  private readonly log: ILogger

  constructor(private readonly deps: ParticipantServiceDeps) {
    this.log = deps.logger.push({ component: ParticipantService.name })
  }

  async bulkCreate(payload: PostParticipantsBulkRequest, source: string): Promise<PostParticipantsBulkResponse> {
    try {
      const inserting = payload.partyList.map((party) => this.createOneParty(party, source))
      const partyList = await Promise.all(inserting)
      this.log.push({ partyList }).verbose('bulkCreate is done')
      return { partyList }
    } catch (err: unknown) {
      this.log.error('error in bulkCreate: ', err)
      throw err
    }
  }

  async createOneParty(partyId: PartyIdInfo, source: string): Promise<PartyResult> {
    const log = this.log.push({ partyId, source })

    try {
      if (partyId.partyIdType !== 'MSISDN') {
        const errMessage = ERROR_MESSAGES.unsupportedPartyIdType
        log.warn(`${errMessage}, but got ${partyId.partyIdType}`)
        throw new Error(errMessage)
      }

      const item: PartyMapItem = {
        id: partyId.partyIdentifier,
        subId: partyId.partySubIdOrType || '',
        fspId: partyId.fspId || source
      }
      if (!item.fspId) {
        const errMessage = ERROR_MESSAGES.noPartyFspId
        log.warn(errMessage, { item })
        throw new Error(errMessage)
      }

      await this.deps.oracleDB.insert(item)
      log.debug('createOneParty is done')

      return { partyId }
    } catch (err: unknown) {
      const errorInformation = this.formatErrorInfo()
      log.error('error in createOneParty', err)
      return { partyId, errorInformation }
    }
  }

  formatErrorInfo(): ErrorInformation {
    // todo: think, if we need to get some details from actual error
    const { code, message } = Enums.FSPIOPErrorCodes['ADD_PARTY_INFO_ERROR']
    return {
      errorCode: code,
      errorDescription: message
    }
  }

  // todo: move all methods from  /.participants here
}
