'use strict'
import { Knex } from 'knex'

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

export function seed(knex: Knex): Promise<Knex.QueryBuilder<number[]>> {
  return knex('oracleMSISDN')
    .del()
    .then(() => knex('oracleMSISDN').insert(msisdns))
}
