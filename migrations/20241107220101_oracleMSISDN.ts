import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void | Knex.SchemaBuilder> {
  return knex.schema.hasTable('oracleMSISDN').then((exists: boolean): Knex.SchemaBuilder | void => {
    if (!exists) {
      return knex.schema.createTable('oracleMSISDN', (t: Knex.CreateTableBuilder): void => {
        t.string('id').primary().notNullable()
        t.string('fspId', 32).notNullable()
      })
    }
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTableIfExists('oracleMSISDN')
}
