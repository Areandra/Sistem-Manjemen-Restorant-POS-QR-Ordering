import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('order_id').unsigned().references('id').inTable('orders')
      table.integer('order_item_id').unsigned().references('id').inTable('order_items')
      table.string('kot_number')
      table.enum('section', ['kitchen', 'bar'])
      table.enum('status', ['sent', 'viewed', 'processing', 'done']).defaultTo('sent')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
