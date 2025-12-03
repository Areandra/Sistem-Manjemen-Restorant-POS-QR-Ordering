import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('table_id').unsigned().references('id').inTable('tables')
      table.string('session_token')
      table.timestamp('started_at')
      table.timestamp('ended_at').nullable()
      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
