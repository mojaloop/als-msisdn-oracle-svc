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

    test('should return error when ID is missing (e.g., /participants/MSISDN/)', async () => {
      expect.assertions(4)
      const payload = fixtures.mockPostParticipantsRequest()
      
      await axios.post(`${BASE_URL}/MSISDN/`, payload)
        .catch((err) => {
          expect(err.response.status).toBe(404) // Now consistently returns 404 with improved validation
          expect(err.response.data).toBeDefined()
          expect(err.response.data.errorInformation).toBeDefined()
          expect(err.response.data.errorInformation.errorCode).toBe('3002')
        })
    })

    test('should handle URL with trailing slash (e.g., /participants/MSISDN/9998887777/)', async () => {
      const payload = fixtures.mockPostParticipantsRequest()
      const id = '9998887777'
      
      // Hapi strips trailing slashes, so this should succeed
      const response = await axios.post(`${BASE_URL}/MSISDN/${id}/`, payload)
      expect(response.status).toBe(201)
    })

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

  describe('GET /participants/{Type}/{ID} endpoint', () => {
    test('should return error when ID is missing (e.g., /participants/MSISDN/)', async () => {
      expect.assertions(4)
      
      await axios.get(`${BASE_URL}/MSISDN/`)
        .catch((err) => {
          expect(err.response.status).toBe(404) // Now consistently returns 404 with improved validation
          expect(err.response.data).toBeDefined()
          expect(err.response.data.errorInformation).toBeDefined()
          expect(err.response.data.errorInformation.errorCode).toBe('3002')
        })
    })

    test('should handle URL with trailing slash (e.g., /participants/MSISDN/9998887777/)', async () => {
      const id = String(Date.now())
      // First create the party
      const payload = fixtures.mockPostParticipantsRequest()
      await axios.post(`${BASE_URL}/MSISDN/${id}`, payload)
      
      // Hapi strips trailing slashes, so this should succeed
      const response = await axios.get(`${BASE_URL}/MSISDN/${id}/`)
      expect(response.status).toBe(200)
      expect(response.data.partyList).toBeDefined()
    })

    test('should return 200 for a valid GET request', async () => {
      const id = String(Date.now())
      // First create the party
      const payload = fixtures.mockPostParticipantsRequest()
      await axios.post(`${BASE_URL}/MSISDN/${id}`, payload)
      
      // Then retrieve it
      const { status, data } = await axios.get(`${BASE_URL}/MSISDN/${id}`)
      expect(status).toBe(200)
      expect(data.partyList).toBeDefined()
    })
  })

  describe('PUT /participants/{Type}/{ID} endpoint', () => {
    test('should return error when ID is missing (e.g., /participants/MSISDN/)', async () => {
      expect.assertions(4)
      const payload = fixtures.mockPostParticipantsRequest()
      
      await axios.put(`${BASE_URL}/MSISDN/`, payload)
        .catch((err) => {
          expect(err.response.status).toBe(404) // Now consistently returns 404 with improved validation
          expect(err.response.data).toBeDefined()
          expect(err.response.data.errorInformation).toBeDefined()
          expect(err.response.data.errorInformation.errorCode).toBe('3002')
        })
    })

    test('should handle URL with trailing slash (e.g., /participants/MSISDN/9998887777/)', async () => {
      const payload = fixtures.mockPostParticipantsRequest()
      const id = '9998887777_put'
      
      // Hapi strips trailing slashes, so this should succeed
      const response = await axios.put(`${BASE_URL}/MSISDN/${id}/`, payload)
      expect(response.status).toBe(200)
    })
  })

  describe('DELETE /participants/{Type}/{ID} endpoint', () => {
    test('should return error when ID is missing (e.g., /participants/MSISDN/)', async () => {
      expect.assertions(4)
      
      await axios.delete(`${BASE_URL}/MSISDN/`)
        .catch((err) => {
          expect(err.response.status).toBe(404) // Now consistently returns 404 with improved validation
          expect(err.response.data).toBeDefined()
          expect(err.response.data.errorInformation).toBeDefined()
          expect(err.response.data.errorInformation.errorCode).toBe('3002')
        })
    })

    test('should handle URL with trailing slash (e.g., /participants/MSISDN/9998887777/)', async () => {
      const id = '9998887777_delete'
      
      // Hapi strips trailing slashes, so this should succeed
      const response = await axios.delete(`${BASE_URL}/MSISDN/${id}/`)
      expect(response.status).toBe(204)
    })
  })
})
