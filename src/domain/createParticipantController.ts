import { IParticipantController } from '~/domain/types'
import { ParticipantController } from '~/domain/ParticipantController'
import { ParticipantService } from '~/domain/ParticipantService'
import { ServerApplicationState } from '@hapi/hapi'

export const createParticipantController = ({ oracleDB, logger }: ServerApplicationState): IParticipantController => {
  const participantService = new ParticipantService({ oracleDB, logger })
  return new ParticipantController({ participantService, logger })
}
