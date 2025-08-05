import axios from 'axios'

describe('health', () => {
  it('performs a health check', async () => {
    // Arrange
    const expected = expect.objectContaining({
      status: 'OK',
      services: [{
        service: 'datastore',
        status: 'OK'
      }],
      startTime: expect.stringMatching('.*'),
      versionNumber: expect.stringMatching('.*')
    })

    // Act
    const result = (await axios.get('http://localhost:3000/health')).data

    // Assert
    expect(result).toStrictEqual(expected)
  })
})
