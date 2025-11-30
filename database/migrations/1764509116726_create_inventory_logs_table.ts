import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inventory_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('inventory_id').unsigned().references('id').inTable('inventories')
      table.integer('change')
      table.enum('type', ['in', 'out', 'adjustment']).defaultTo
      table.string('reference').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
