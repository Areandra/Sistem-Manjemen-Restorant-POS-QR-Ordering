import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menu_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('category_id').unsigned().references('id').inTable('menu_categories')
      table.string('name')
      table.text('description').nullable()
      table.decimal('price', 12, 2)
      table.decimal('cost_of_goods', 12, 2).nullable()
      table.string('image_url').nullable()
      table.boolean('is_available').defaultTo(true)
      table.string('sku').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
