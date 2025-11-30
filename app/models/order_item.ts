import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Order from '#models/order'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import MenuItem from '#models/menu_item'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare menuItemId: number

  @column()
  declare quantity: number

  @column()
  declare price: number

  @column()
  declare subtotal: number

  @column()
  declare notes: string | null

  @column()
  declare status: 'ordered' | 'cooking' | 'ready' | 'delivered'

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => MenuItem)
  declare menuItem: BelongsTo<typeof MenuItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
