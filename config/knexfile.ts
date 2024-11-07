/*****
 License
 --------------
 Copyright © 2020 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the
 Apache License, Version 2.0 (the 'License') and you may not use these files
 except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop
 files are distributed onan 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 ANY KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 - Vijay Kumar Guthi <vijaya.guthi@infitx.com>
 --------------
 ******/
import path from 'path'
import ConvictFileConfig from './convictFileConfig'
const migrationsDirectory = path.join(__dirname, '../migrations')
const seedsDirectory = path.join(__dirname, '../seeds')

export interface DbConnection {
  host: string
  port: number
  user: string
  password: string
  database: string
}

export interface DbPool {
  min: number
  max: number
  acquireTimeoutMillis: number
  createTimeoutMillis: number
  destroyTimeoutMillis: number
  idleTimeoutMillis: number
  reapIntervalMillis: number
  createRetryIntervalMillis: number
}

export interface DatabaseConfig {
  client: string
  version?: string
  useNullAsDefault?: boolean
  connection: DbConnection | string
  pool?: DbPool
  migrations: {
    directory: string
    tableName: string
    stub?: string
    loadExtensions: string[]
  }

  seeds: {
    directory: string
    loadExtensions: string[]
  }
}

const ConfigFileProperties = ConvictFileConfig.getProperties()
const KnexDatabaseConfig: DatabaseConfig = {
  client: ConfigFileProperties.DATABASE.DIALECT,
  version: '5.7',
  connection: {
    host: ConfigFileProperties.DATABASE.HOST,
    port: ConfigFileProperties.DATABASE.PORT,
    user: ConfigFileProperties.DATABASE.USER,
    password: ConfigFileProperties.DATABASE.PASSWORD,
    database: ConfigFileProperties.DATABASE.DATABASE
  },
  useNullAsDefault: ConfigFileProperties.DATABASE.USE_NULL_AS_DEFAULT,
  pool: {
    min: ConfigFileProperties.DATABASE.POOL_MIN_SIZE || 2,
    max: ConfigFileProperties.DATABASE.POOL_MAX_SIZE || 10,
    acquireTimeoutMillis: ConfigFileProperties.DATABASE.ACQUIRE_TIMEOUT_MILLIS || 30000,
    createTimeoutMillis: ConfigFileProperties.DATABASE.CREATE_TIMEOUT_MILLIS || 3000,
    destroyTimeoutMillis: ConfigFileProperties.DATABASE.DESTROY_TIMEOUT_MILLIS || 5000,
    idleTimeoutMillis: ConfigFileProperties.DATABASE.IDLE_TIMEOUT_MILLIS || 30000,
    reapIntervalMillis: ConfigFileProperties.DATABASE.REAP_INTERVAL_MILLIS || 1000,
    createRetryIntervalMillis: ConfigFileProperties.DATABASE.CREATE_RETRY_INTERVAL_MILLIS || 20
  },
  migrations: {
    directory: migrationsDirectory,
    stub: `${migrationsDirectory}/migration.template`,
    tableName: 'oracleMSISDN_migration',
    loadExtensions: ['.js']
  },
  seeds: {
    directory: seedsDirectory,
    loadExtensions: ['.js']
  }
}

export default KnexDatabaseConfig
module.exports = KnexDatabaseConfig
