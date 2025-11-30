import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('order_id').unsigned().references('id').inTable('orders')
      table.enum('payment_method', ['cash', 'qris', 'e-wallet', 'transfer'])
      table.decimal('amount', 12, 2)
      table.decimal('change', 12, 2).defaultTo(0)
      table.enum('status', ['paid', 'refund']).defaultTo('paid')
      table.timestamp('paid_at')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
