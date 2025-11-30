import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Order from './order.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare paymentMethod: 'cash' | 'qris' | 'e-wallet' | 'transfer'

  @column()
  declare amount: number

  @column()
  declare change: number

  @column()
  declare status: 'paid' | 'refund'

  @column.dateTime({ autoCreate: true })
  declare paidAt: DateTime

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
