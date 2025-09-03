'use strict'
import { Knex } from 'knex'
import { logger } from '~/shared/logger'

export const msisdns = [
  {
    id: '000000',
    fspId: 'dfspa'
  },
  {
    id: '111111',
    fspId: 'dfspb'
  },
  {
    id: '222222',
    fspId: 'dfspc'
  }
]

export function seed(knex: Knex): Promise<number[] | void> {
  return knex('oracleMSISDN')
    .then(() => knex('oracleMSISDN').insert(msisdns))
    .then((data) => {
      logger.info('seed is done: ', { data })
      return data
    })
    .catch(err => { logger.error('error in seed: ', err) })
}
