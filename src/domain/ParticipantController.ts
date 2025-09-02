import { ResponseValue } from '@hapi/hapi'
import { ILogger, IParticipantController, IParticipantService, ControllerResponse, ErrorResponse } from '~/domain/types'
import { ParticipantsTypeIDPostPutRequest, PostParticipantsBulkRequest } from '~/interface/types'
import {
  CustomOracleError,
  IDTypeNotSupported,
  InternalServerError,
  MalformedParameterError,
  MissingParameterError
} from '~/model/errors'

export type ParticipantControllerDeps = {
  logger: ILogger
  participantService: IParticipantService
}

export class ParticipantController implements IParticipantController {
  protected log: ILogger

  constructor(protected readonly deps: ParticipantControllerDeps) {
    this.log = deps.logger.child({ component: this.constructor.name })
  }

  async handleBulkCreate(payload: PostParticipantsBulkRequest, source: string) {
    try {
      const result = await this.deps.participantService.bulkCreate(payload, source)
      return this.formatSuccessResponse(result, 201)
    } catch (err) {
      return this.formatErrorResponse('error in handleBulkCreate: ', err)
    }
  }

  async handleGetPartyById(partyType: string, partyId: string, subId?: string) {
    try {
      // todo: find a better way to validate input
      arguments.length === 2
        ? this.validateRequestParams(partyType, partyId)
        : this.validateRequestParamsWithSubId(partyType, partyId, subId)

      const party = await this.deps.participantService.retrieveOneParty(partyId, subId)
      return this.formatSuccessResponse({
        partyList: [party]
      })
    } catch (err) {
      return this.formatErrorResponse('error handleGetPartyById: ', err)
    }
  }

  async handlePostParty(partyType: string, partyId: string, payload: ParticipantsTypeIDPostPutRequest, subId?: string) {
    try {
      // todo: find a better way to validate input
      arguments.length === 3 // no subId passed
        ? this.validateRequestParams(partyType, partyId)
        : this.validateRequestParamsWithSubId(partyType, partyId, subId)

      const isCreated = await this.deps.participantService.createPartyMapItem(partyId, payload, subId)
      const statusCode = isCreated ? 201 : 500
      this.log.info('handlePostParty is done: ', { isCreated, partyId, statusCode })
      return this.formatSuccessResponse(undefined, statusCode)
    } catch (err) {
      return this.formatErrorResponse('error handlePostParty: ', err)
    }
  }

  async handlePutParty(partyType: string, partyId: string, payload: ParticipantsTypeIDPostPutRequest, subId?: string) {
    try {
      // todo: find a better way to validate input
      arguments.length === 3 // no subId passed
        ? this.validateRequestParams(partyType, partyId)
        : this.validateRequestParamsWithSubId(partyType, partyId, subId)

      const count = await this.deps.participantService.updateParty(partyId, payload, subId)
      this.log.verbose('handlePutParty is done: ', { count, partyId })
      // todo: think if count === 0?
      return this.formatSuccessResponse(undefined)
    } catch (err) {
      return this.formatErrorResponse('error handlePutParty: ', err)
    }
  }

  async handleDeleteParty(partyType: string, partyId: string, subId?: string) {
    try {
      // todo: find a better way to validate input
      arguments.length === 2
        ? this.validateRequestParams(partyType, partyId)
        : this.validateRequestParamsWithSubId(partyType, partyId, subId)

      const count = await this.deps.participantService.deleteParty(partyId, subId)
      this.log.verbose('handleDeleteParty is done: ', { count, partyId, subId })
      // todo: think if count === 0?
      return this.formatSuccessResponse(undefined, 204)
    } catch (err) {
      return this.formatErrorResponse('error handleDeleteParty: ', err)
    }
  }

  validateRequestParams(partyType: string, partyId: string /*, subId?: string*/): boolean {
    // todo: use Joi to validate input
    if (partyType !== 'MSISDN') {
      throw new IDTypeNotSupported()
    }
    if (!partyId) {
      throw new MissingParameterError('ID parameter is missing')
    }
    if (partyId === '{ID}' || partyId.includes('{') || partyId.includes('}')) {
      throw new MalformedParameterError(`Invalid ID parameter: ${partyId}`)
    }

    return true
  }

  validateRequestParamsWithSubId(partyType: string, partyId: string, subId?: string): boolean {
    this.validateRequestParams(partyType, partyId)

    if (!subId) {
      throw new MissingParameterError('SubId parameter is missing')
    }
    if (subId === '{SubId}' || subId.includes('{') || subId.includes('}')) {
      throw new MalformedParameterError(`Invalid SubId parameter: ${subId}`)
    }

    return true
  }

  protected formatSuccessResponse<T = ResponseValue>(result: T, statusCode = 200): ControllerResponse<T> {
    const response = {
      result,
      statusCode
    }
    this.log.verbose('formatSuccessResponse is done: ', { response })
    return response
  }

  protected formatErrorResponse(message: string, cause: unknown): ControllerResponse<ErrorResponse> {
    this.log.error(message, cause)
    const error = cause instanceof CustomOracleError ? cause : new InternalServerError(message, { cause })
    const { errorInformation, statusCode } = error

    const response = {
      result: { errorInformation },
      statusCode
    }
    this.log.verbose('formatErrorResponse is done: ', { response })
    return response
  }
}
