'use strict'

import { Schemas } from '@mojaloop/api-snippets/lib/fspiop/v1_1'

export interface ParticipantsTypeIDSubIDPut {
  fspId: Schemas.FspId
  currency?: Schemas.Currency
  extensionList?: Schemas.ExtensionList
}
