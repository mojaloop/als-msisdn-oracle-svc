/*****
License
--------------
Copyright © 2020-2025 Mojaloop Foundation
The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Contributors
--------------
This is the official list of the Mojaloop project contributors for this file.
Names of the original copyright holders (individuals or organizations)
should be listed with a '*' in the first column. People who have
contributed from an organization can be listed under the organization
that actually holds the copyright for their contributions (see the
Mojaloop Foundation for an example). Those individuals should have
their names indented and be marked with a '-'. Email address can be added
optionally within square brackets <email>.

* Mojaloop Foundation
- Name Surname <name.surname@mojaloop.io>

* Eugen Klymniuk <eugen.klymniuk@infitx.com>
*****/

import { Enums } from '@mojaloop/central-services-error-handling';
import {
  PartyIdInfo,
  PostParticipantsBulkRequest,
  PostParticipantsBulkResponse,
  PartyResult,
  ErrorInformation,
  PartyTypeIdInfo,
  ParticipantsTypeIDPostPutRequest
} from '../interface/types';
import { ParticipantServiceDeps, PartyMapItem, ILogger, IParticipantService } from './types';
import { ERROR_MESSAGES } from '~/constants';
import { DuplicationPartyError } from '~/model/errors';
import { partyMapItemDto } from '~/shared/dto';

export class ParticipantService implements IParticipantService {
  private readonly log: ILogger;

  constructor(private readonly deps: ParticipantServiceDeps) {
    this.log = deps.logger.child({ component: ParticipantService.name });
  }

  async createPartyMapItem(partyId: string, partyDetails: ParticipantsTypeIDPostPutRequest, subId?: string) {
    const { oracleDB } = this.deps;
    try {
      const item = partyMapItemDto(partyId, partyDetails, subId);
      const isCreated = await oracleDB.insert(item);
      this.log.verbose('createPartyMapItem is done: ', { item, isCreated });
      return isCreated;
    } catch (err: unknown) {
      const isDuplication = oracleDB.isDuplicationError(err);
      this.log[isDuplication ? 'warn' : 'error']('error in createPartyMapItem: ', err);
      throw isDuplication ? new DuplicationPartyError(`Party already exists [id: ${partyId}]`) : err;
    }
  }

  async bulkCreate(payload: PostParticipantsBulkRequest, source: string): Promise<PostParticipantsBulkResponse> {
    try {
      const inserting = payload.partyList.map((party) => this.createOnePartySafe(party, source));
      const partyList = await Promise.all(inserting);
      this.log.push({ partyList }).verbose('bulkCreate is done');
      return { partyList };
    } catch (err: unknown) {
      this.log.error('error in bulkCreate: ', err);
      throw err;
    }
  }

  async updateParty(partyId: string, partyDetails: ParticipantsTypeIDPostPutRequest, subId?: string) {
    const item = partyMapItemDto(partyId, partyDetails, subId);
    return this.deps.oracleDB.update(item);
  }

  async retrieveOneParty(id: string, subId?: string): Promise<PartyTypeIdInfo> {
    const partyMapItem = await this.deps.oracleDB.retrieve(id, subId);
    // if no partyMapItem, NotFoundError will be thrown
    this.log.debug('retrieve partyMapItem from DB is done: ', { id, subId, partyMapItem });

    const partyInfo: PartyTypeIdInfo = {
      fspId: partyMapItem.fspId,
      ...(partyMapItem.subId && { partySubIdOrType: partyMapItem.subId })
    };
    this.log.verbose('retrieveOneParty is done: ', { id, subId, partyInfo });

    return partyInfo;
  }

  async deleteParty(id: string, subId?: string): Promise<number> {
    return this.deps.oracleDB.delete(id, subId);
  }

  // find a better method name
  private async createOnePartySafe(partyId: PartyIdInfo, source: string): Promise<PartyResult> {
    const { oracleDB } = this.deps;
    const log = this.log.push({ partyId, source });

    try {
      if (partyId.partyIdType !== 'MSISDN') {
        const errMessage = ERROR_MESSAGES.unsupportedPartyIdType;
        log.warn(`${errMessage}, but got ${partyId.partyIdType}`);
        throw new Error(errMessage);
      }

      const item: PartyMapItem = {
        id: partyId.partyIdentifier,
        subId: partyId.partySubIdOrType || '',
        fspId: partyId.fspId || source
      };
      if (!item.fspId) {
        const errMessage = ERROR_MESSAGES.noPartyFspId;
        log.warn(errMessage, { item });
        throw new Error(errMessage);
      }

      await oracleDB.insert(item);
      log.debug('createOneParty is done: ', { item });

      return { partyId };
    } catch (err: unknown) {
      const errorInformation = this.formatErrorInfo(err);
      log.error('error in createOneParty', err);
      return { partyId, errorInformation };
    }
  }

  formatErrorInfo(err: unknown): ErrorInformation {
    // todo: think, if we need to get some details from actual error
    const { code, message } = Enums.FSPIOPErrorCodes['ADD_PARTY_INFO_ERROR'];
    return {
      errorCode: code,
      errorDescription: err instanceof Error ? `${message} - ${err.message}` : message
    };
  }
}
