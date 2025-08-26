/*****
 License
 --------------
 Copyright © 2020 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the
 Apache License, Version 2.0 (the 'License') and you may not use these files
 except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop
 files are distributed onan 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 ANY KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.
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

 - Vijay Kumar Guthi <vijaya.guthi@infitx.com>
 --------------
 ******/

export class NotFoundError extends Error {
  public readonly statusCode = 404;

  public constructor(resource: string, id: string) {
    super(`NotFoundError: ${resource} for MSISDN Id ${id}`);
    this.name = 'NotFoundError';
  }
}

export class IDTypeNotSupported extends Error {
  public readonly statusCode = 400;

  public constructor() {
    super('This service supports only MSISDN ID types');
    this.name = 'IDTypeNotSupported';
  }
}

export class MalformedParameterError extends Error {
  public readonly statusCode = 400;

  public constructor(parameter: string, value: string) {
    super(`Invalid ${parameter} parameter: ${value}. ${parameter} must not be a placeholder value`);
    this.name = 'MalformedParameterError';
  }
}
