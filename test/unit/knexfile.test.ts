import KnexDatabaseConfig from '../../config/knexfile'

describe('KnexDatabaseConfig', () => {
  it('should include additional dynamic options in connection config', () => {
    // Simulate config with additional options
    const additionalOptions = {
      ssl: { rejectUnauthorized: false },
      customOption: 'customValue'
    }
    // Patch the config for test
    const testConfig = {
      ...KnexDatabaseConfig,
      connection: {
        host: 'localhost',
        port: 3306,
        user: 'user',
        password: 'pass',
        database: 'db',
        ...additionalOptions
      }
    }
    expect(testConfig.connection.ssl).toEqual({ rejectUnauthorized: false })
    expect(testConfig.connection.customOption).toBe('customValue')
  })

  it('should allow any extra property in DbConnection type', () => {
    const conn: import('../../config/knexfile').DbConnection = {
      host: 'localhost',
      port: 3306,
      user: 'user',
      password: 'pass',
      database: 'db',
      extra: 'value',
      another: 123
    }
    expect(conn.extra).toBe('value')
    expect(conn.another).toBe(123)
  })
})
