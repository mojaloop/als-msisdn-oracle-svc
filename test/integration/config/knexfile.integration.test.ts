import KnexDatabaseConfig from '../../../config/knexfile'
import { Knex, knex } from 'knex'

function buildConnection(overrides: Record<string, unknown> = {}) {
  if (typeof KnexDatabaseConfig.connection === 'object' && KnexDatabaseConfig.connection !== null) {
    // Remove ssl if present for non-SSL test
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ssl, ...rest } = KnexDatabaseConfig.connection
    return { ...rest, ...overrides }
  }
  return { ...overrides }
}

async function getSslVersion(db: Knex): Promise<string> {
  const result = await db.raw("SHOW STATUS LIKE 'Ssl_version'")
  if (Array.isArray(result) && result[0] && result[0][0]) {
    return result[0][0].Value || result[0][0].Variable_value || ''
  } else if (result && result.rows && result.rows[0]) {
    return result.rows[0].Value || result.rows[0].Variable_value || ''
  }
  return ''
}

describe('KnexDatabaseConfig integration', () => {
  it('should connect without SSL if SSL option is not passed', async () => {
    const testConfig = {
      ...KnexDatabaseConfig,
      connection: buildConnection({ debug: true })
    }
    const db: Knex = knex(testConfig)
    expect(db.client.config.connection.debug).toBe(true)
    const sslVersion = await getSslVersion(db)
    expect(sslVersion).toBeFalsy()
    await db.destroy()
  })

  it('should allow dynamic SSL option in Knex connection and verify TLS is used', async () => {
    const testConfig = {
      ...KnexDatabaseConfig,
      connection: buildConnection({ ssl: { rejectUnauthorized: false } })
    }
    const db: Knex = knex(testConfig)
    expect(db.client.config.connection.ssl).toEqual({ rejectUnauthorized: false })
    const sslVersion = await getSslVersion(db)
    expect(sslVersion).toBeTruthy()
    await db.destroy()
  })
})
