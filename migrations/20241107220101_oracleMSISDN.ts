import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void | Knex.SchemaBuilder> {
  return knex.schema.hasTable('oracleMSISDN').then((exists: boolean): Knex.SchemaBuilder | void => {
    if (!exists) {
      return knex.schema.createTable('oracleMSISDN', (t: Knex.CreateTableBuilder): void => {
        t.string('id').notNullable()
        t.string('subId').notNullable().defaultTo('')
        t.string('fspId', 32).notNullable()
        t.primary(['id', 'subId'])
      })
    }
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTableIfExists('oracleMSISDN')
}
