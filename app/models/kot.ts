import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Order from './order.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import OrderItem from './order_item.js'

export default class Kot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare orderItemId: number

  @column()
  declare kotNumber: string

  @column()
  declare section: 'kitchen' | 'bar'

  @column()
  declare status: 'sent' | 'viewed' | 'processing' | 'done'

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => OrderItem)
  declare orderItem: BelongsTo<typeof OrderItem>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
