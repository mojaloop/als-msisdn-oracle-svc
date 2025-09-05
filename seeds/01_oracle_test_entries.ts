'use strict'
import { Knex } from 'knex'
import { logger } from '~/shared/logger'
import msisdns from './01_msisdns.json'

export function seed(knex: Knex): Promise<number[] | void> {
  logger.info('seed is running...', { msisdns })
  return knex('oracleMSISDN')
    .then(() => knex('oracleMSISDN').insert(msisdns))
    .catch(err => { logger.error('error in seed: ', err) })
}
