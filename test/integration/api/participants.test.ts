import axios from 'axios'
import { IDTypeNotSupported } from '~/model/errors'
import * as fixtures from '../../fixtures'

describe('participants API Tests -->', () => {
  describe('POST /participants endpoint', () => {
    const sendPostParticipantsBulkRequest = async (payload: unknown) =>
      axios.post('http://localhost:3000/participants', payload)

    test('should throw error if partyIdType is wrong', async () => {
      expect.hasAssertions()
      const payload = fixtures.mockPostParticipantsBulkRequest({
        partyList: [fixtures.mockPostParticipantsBulkItem({ partyIdType: 'EMAIL' })]
      })
      const { response } = await sendPostParticipantsBulkRequest(payload).catch((e) => e)

      expect(response.status).toBe(400)
      expect(response.data.errorInformation.errorDescription).toContain(new IDTypeNotSupported().message)
    })

    test('should create a new party', async () => {
      const payload = fixtures.mockPostParticipantsBulkRequest()
      const result = await sendPostParticipantsBulkRequest(payload)
      expect(result.status).toBe(201)
    })
  })
})
