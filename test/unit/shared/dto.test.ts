import { baseErrorResponseDto, addPartyErrorResponseDto } from '~/shared/dto'

describe('shared/dto', (): void => {
  describe('baseErrorResponseDto', (): void => {
    it('should return error response with default values when no params provided', (): void => {
      const result = baseErrorResponseDto()
      expect(result.statusCode).toBe(500)
      expect(result.errorInformation.errorCode).toBe('2001')
      expect(result.errorInformation.errorDescription).toBe('Internal server error')
    })

    it('should return error response with custom values', (): void => {
      const result = baseErrorResponseDto(400, 'MALFORMED_SYNTAX')
      expect(result.statusCode).toBe(400)
      expect(result.errorInformation.errorCode).toBe('3101')
      expect(result.errorInformation.errorDescription).toBe('Malformed syntax')
    })
  })

  describe('addPartyErrorResponseDto', (): void => {
    it('should return add party error response', (): void => {
      const result = addPartyErrorResponseDto(400)
      expect(result.statusCode).toBe(400)
      expect(result.errorInformation.errorCode).toBe('3003')
      expect(result.errorInformation.errorDescription).toBe('Add Party information error')
    })
  })
})
