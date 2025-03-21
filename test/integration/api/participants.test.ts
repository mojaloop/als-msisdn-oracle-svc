import axios from 'axios'
import * as fixtures from '../../fixtures'

const BASE_URL = 'http://localhost:3000/participants'

describe('participants API Tests -->', () => {
  describe('POST /participants endpoint', () => {
    const sendPostParticipantsBulkRequest = async (payload: unknown) => axios.post(BASE_URL, payload)

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

  describe('POST /participants/{Type}/{ID} endpoint', () => {
    const sendPostParticipantsRequest = async (payload: unknown, id: string) =>
      axios.post(`${BASE_URL}/MSISDN/${id}`, payload)

    test('should create a new party', async () => {
      const payload = fixtures.mockPostParticipantsRequest()
      const id = String(Date.now())
      const { status, data } = await sendPostParticipantsRequest(payload, id)

      expect(status).toBe(201)
      expect(data).toBe('')
    })

    test('should return 400 error if party already exists in DB', async () => {
      expect.assertions(3)
      const payload = fixtures.mockPostParticipantsRequest()
      const id = String(Date.now())

      const { status } = await sendPostParticipantsRequest(payload, id)
      expect(status).toBe(201)
      // prettier-ignore
      await sendPostParticipantsRequest(payload, id)
        .catch((err) => {
          expect(err.response.status).toBe(400)
          expect(err.response.data.errorInformation.errorCode).toBe('3003')
        })
    })
  })
})
