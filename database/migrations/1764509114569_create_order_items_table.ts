import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('order_id').unsigned().references('id').inTable('orders')
      table.integer('menu_item_id').unsigned().references('id').inTable('menu_items')
      table.integer('quantity').defaultTo(1)
      table.decimal('price', 12, 2)
      table.decimal('subtotal', 12, 2)
      table.text('notes').nullable()
      table.enum('status', ['cart', 'ordered', 'cooking', 'ready', 'delivered']).defaultTo('cart')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
