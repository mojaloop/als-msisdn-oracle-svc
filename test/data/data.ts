import { ResponseObject } from '@hapi/hapi'
import { PartyMapItem } from '~/model/MSISDN'

/*
 * Mock Request Resources
 */
export const h: Record<string, unknown> = {
  response: (): ResponseObject => {
    return {
      code: (num: number): ResponseObject => {
        return {
          statusCode: num
        } as unknown as ResponseObject
      }
    } as unknown as ResponseObject
  }
}

export const mockPartyMapItem: PartyMapItem = {
  id: '987654321',
  fspId: 'dfspa'
}

export const getParticipantsByTypeAndIDResponse: Record<string, unknown> = {
  partyList: [{ fspId: 'dfspa' }]
}

export const postParticipantsRequest: Record<string, unknown> = {
  method: 'post',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {
    requestId: 'b56b4406-c432-45d1-aae1-d8c00ec903b3',
    partyList: [
      {
        partyIdType: 'MSISDN',
        partyIdentifier: '256d5bbc-535c-4060-890b-ff7a06e781f4',
        fspId: 'dfspa'
      }
    ]
  }
}

export const getParticipantsByTypeAndIDRequest: Record<string, unknown> = {
  method: 'get',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {},
  params: {
    ID: '987654321',
    Type: 'MSISDN'
  }
}

export const postParticipantsByTypeAndIDRequest: Record<string, unknown> = {
  method: 'post',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {
    currency: 'USD',
    fspId: 'dfspa'
  },
  params: {
    ID: '987654321',
    Type: 'MSISDN'
  }
}

export const putParticipantsByTypeAndIDRequest: Record<string, unknown> = {
  method: 'put',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {
    currency: 'USD',
    fspId: 'dfspa'
  },
  params: {
    ID: '987654321',
    Type: 'MSISDN'
  }
}

export const deleteParticipantsByTypeAndIDRequest: Record<string, unknown> = {
  method: 'delete',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {},
  params: {
    ID: '987654321',
    Type: 'MSISDN'
  }
}

export const getParticipantsByWrongTypeAndIDRequest: Record<string, unknown> = {
  method: 'get',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {},
  params: {
    ID: '987654321',
    Type: 'ACCOUNT_ID'
  }
}

export const postParticipantsByWrongTypeAndIDRequest: Record<string, unknown> = {
  method: 'post',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {
    currency: 'USD',
    fspId: 'dfspa'
  },
  params: {
    ID: '987654321',
    Type: 'ACCOUNT_ID'
  }
}

export const putParticipantsByWrongTypeAndIDRequest: Record<string, unknown> = {
  method: 'put',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {
    currency: 'USD',
    fspId: 'dfspa'
  },
  params: {
    ID: '987654321',
    Type: 'ACCOUNT_ID'
  }
}

export const deleteParticipantsByWrongTypeAndIDRequest: Record<string, unknown> = {
  method: 'delete',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {},
  params: {
    ID: '987654321',
    Type: 'ACCOUNT_ID'
  }
}
