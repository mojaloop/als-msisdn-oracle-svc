import { ResponseObject } from '@hapi/hapi'
import { PartyMapItem } from '~/model/MSISDN'

/*
 * Mock Request Resources
 */
export const h: Record<string, unknown> = {
  response: (payload?: any): ResponseObject => {
    return {
      code: (num: number): ResponseObject => {
        return {
          statusCode: num,
          source: payload
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

// SubId

export const mockPartyMapItemSubId: PartyMapItem = {
  id: '987654321',
  subId: 'WORK',
  fspId: 'dfspa'
}

export const getParticipantsByTypeAndIDResponseSubId: Record<string, unknown> = {
  partyList: [{ fspId: 'dfspa' }]
}

export const postParticipantsRequestSubId: Record<string, unknown> = {
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
        partySubIdOrType: 'WORK',
        fspId: 'dfspa'
      }
    ]
  }
}

export const getParticipantsByTypeAndIDRequestSubId: Record<string, unknown> = {
  method: 'get',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {},
  params: {
    ID: '987654321',
    Type: 'MSISDN',
    SubId: 'WORK'
  }
}

export const postParticipantsByTypeAndIDRequestSubId: Record<string, unknown> = {
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
    Type: 'MSISDN',
    SubId: 'WORK'
  }
}

export const putParticipantsByTypeAndIDRequestSubId: Record<string, unknown> = {
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
    Type: 'MSISDN',
    SubId: 'WORK'
  }
}

export const deleteParticipantsByTypeAndIDRequestSubId: Record<string, unknown> = {
  method: 'delete',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {},
  params: {
    ID: '987654321',
    Type: 'MSISDN',
    SubId: 'WORK'
  }
}

export const getParticipantsByWrongTypeAndIDRequestSubId: Record<string, unknown> = {
  method: 'get',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {},
  params: {
    ID: '987654321',
    Type: 'ACCOUNT_ID',
    SubId: 'WORK'
  }
}

export const postParticipantsByWrongTypeAndIDRequestSubId: Record<string, unknown> = {
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
    Type: 'ACCOUNT_ID',
    SubId: 'WORK'
  }
}

export const putParticipantsByWrongTypeAndIDRequestSubId: Record<string, unknown> = {
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
    Type: 'ACCOUNT_ID',
    SubId: 'WORK'
  }
}

export const deleteParticipantsByWrongTypeAndIDRequestSubId: Record<string, unknown> = {
  method: 'delete',
  headers: {
    'fspiop-source': 'als',
    'fspiop-destination': 'als-msisdn-oracle-svc'
  },
  payload: {},
  params: {
    ID: '987654321',
    Type: 'ACCOUNT_ID',
    SubId: 'WORK'
  }
}

export const getHealthRequest: Record<string, unknown> = {
  method: 'get',
  headers: {},
  payload: {},
  params: {}
}

export const getMetricsRequest: Record<string, unknown> = {
  method: 'get',
  headers: {},
  payload: {},
  params: {}
}
