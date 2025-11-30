import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tables'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('table_number')
      table.string('qr_code')
      table.enum('status', ['available', 'occupied', 'waiting_payment']).defaultTo('available')
      table.integer('current_session_id').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
