import axios from 'axios'
import * as fixtures from '../../fixtures'

describe('participants API Tests -->', () => {
  describe('POST /participants endpoint', () => {
    const sendPostParticipantsBulkRequest = async (payload: unknown) =>
      axios.post('http://localhost:3000/participants', payload)

    test('should add errorInformation if partyIdType is wrong', async () => {
      const payload = fixtures.mockPostParticipantsBulkRequest({
        partyList: [fixtures.mockPartyIdInfo({ partyIdType: 'EMAIL' })]
      })
      const { status, data } = await sendPostParticipantsBulkRequest(payload)

      expect(status).toBe(201)
      expect(data.partyList[0].errorInformation).toBeDefined()
      expect(data.partyList[0].partyId).toEqual(payload.partyList[0])
    })

    test('should create a new party', async () => {
      const payload = fixtures.mockPostParticipantsBulkRequest()
      const { status, data } = await sendPostParticipantsBulkRequest(payload)
      expect(status).toBe(201)
      expect(data.partyList[0].errorInformation).toBeUndefined()
      expect(data.partyList[0].partyId).toEqual(payload.partyList[0])
    })

    test('should support partial party creation', async () => {
      const payload = fixtures.mockPostParticipantsBulkRequest({
        partyList: [
          fixtures.mockPartyIdInfo({ partyIdType: 'MSISDN' }),
          fixtures.mockPartyIdInfo({ partyIdType: 'EMAIL' })
        ]
      })
      const { status, data } = await sendPostParticipantsBulkRequest(payload)
      expect(status).toBe(201)
      expect(data.partyList[0].errorInformation).toBeUndefined()
      expect(data.partyList[1].errorInformation).toBeDefined()
    })
  })
})
