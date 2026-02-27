import axios from 'axios'

describe('health', () => {
  it('performs a health check', async () => {
    // Arrange
    const expected = expect.objectContaining({
      versionNumber: expect.stringMatching('.*'),
      status: 'OK',
      startTime: expect.stringMatching('.*'),
      services: []
    })

    // Act
    const result = (await axios.get('http://localhost:3000/health')).data

    // Assert
    expect(result).toStrictEqual(expected)
  })
})
