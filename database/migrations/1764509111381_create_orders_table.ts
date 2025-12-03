import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('table_id').unsigned().references('id').inTable('tables')
      table.integer('session_id').unsigned().references('id').inTable('sessions')
      table.string('order_code')
      table.string('type')
      table.string('status').defaultTo('pending')
      table.decimal('subtotal', 12, 2).defaultTo(0)
      table.decimal('tax', 12, 2).defaultTo(0)
      table.decimal('discount', 12, 2).defaultTo(0)
      table.decimal('total', 12, 2).defaultTo(0)
      table.text('notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
