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
import Convict from 'convict'

const ENV_PREFIX = 'ALS_MSISDN_ORACLE_'

export interface FileConfig {
  PORT: number
  HOST: string
  INSPECT: {
    DEPTH: number
    SHOW_HIDDEN: boolean
    COLOR: boolean
  }
  DATABASE: {
    DIALECT: string
    HOST: string
    PORT: number
    USER: string
    PASSWORD: string
    DATABASE: string
    POOL_MIN_SIZE: number
    POOL_MAX_SIZE: number
    ACQUIRE_TIMEOUT_MILLIS: number
    CREATE_TIMEOUT_MILLIS: number
    DESTROY_TIMEOUT_MILLIS: number
    IDLE_TIMEOUT_MILLIS: number
    REAP_INTERVAL_MILLIS: number
    CREATE_RETRY_INTERVAL_MILLIS: number
    USE_NULL_AS_DEFAULT?: boolean
  }
}

const ConvictFileConfig = Convict<FileConfig>({
  PORT: {
    format: Number,
    default: 3000,
    env: ENV_PREFIX + 'PORT'
  },
  HOST: {
    format: String,
    default: '0.0.0.0',
    env: ENV_PREFIX + 'HOST'
  },
  INSPECT: {
    DEPTH: {
      format: Number,
      default: 4
    },
    SHOW_HIDDEN: {
      format: Boolean,
      default: false
    },
    COLOR: {
      format: Boolean,
      default: true
    }
  },
  DATABASE: {
    DIALECT: {
      doc: 'Which database client should we use',
      format: ['mysql', 'sqlite3'],
      default: null
    },
    HOST: {
      doc: 'The hostname of the database you are connecting to',
      format: String,
      default: 'localhost',
      env: ENV_PREFIX + 'DATABASE_HOST'
    },
    PORT: {
      doc: 'The port number to connect to',
      format: Number,
      default: 3306,
      env: ENV_PREFIX + 'DATABASE_PORT'
    },
    USER: {
      doc: 'The MySQL user to authenticate as.',
      format: String,
      default: 'als-msisdn-oracle',
      env: ENV_PREFIX + 'DATABASE_USER'
    },
    PASSWORD: {
      doc: 'The password of that MySQL user',
      format: String,
      default: 'password',
      env: ENV_PREFIX + 'DATABASE_PASSWORD'
    },
    DATABASE: {
      doc: 'Name of the database to use for this connection',
      format: String,
      default: 'als-msisdn-oracle',
      env: ENV_PREFIX + 'DATABASE_NAME'
    },
    POOL_MIN_SIZE: {
      doc: 'Pool minimum size',
      format: Number,
      default: 10
    },
    POOL_MAX_SIZE: {
      doc: 'Pool maximum size',
      format: Number,
      default: 10
    },
    ACQUIRE_TIMEOUT_MILLIS: {
      doc: 'Acquire promises are rejected after this many milliseconds',
      format: Number,
      default: 30000
    },
    CREATE_TIMEOUT_MILLIS: {
      doc: 'Create operations are cancelled after this many milliseconds',
      format: Number,
      default: 30000
    },
    DESTROY_TIMEOUT_MILLIS: {
      doc: 'Destroy operations are awaited for at most this many milliseconds',
      format: Number,
      default: 5000
    },
    IDLE_TIMEOUT_MILLIS: {
      doc: 'Free resources are destroyed after this many milliseconds',
      format: Number,
      default: 30000
    },
    REAP_INTERVAL_MILLIS: {
      doc: 'How often to check for idle resources to destroy',
      format: Number,
      default: 1000
    },
    CREATE_RETRY_INTERVAL_MILLIS: {
      doc: 'How long to idle after failed create before trying again',
      format: Number,
      default: 200
    },
    USE_NULL_AS_DEFAULT: {
      doc: 'Whether or not to use null for everything not specified',
      format: Boolean,
      default: false
    }
  }
})

const ConfigFile = path.join(__dirname, 'default.json')
ConvictFileConfig.loadFile(ConfigFile)
ConvictFileConfig.validate({ allowed: 'strict' })
export default ConvictFileConfig
module.exports = ConvictFileConfig
