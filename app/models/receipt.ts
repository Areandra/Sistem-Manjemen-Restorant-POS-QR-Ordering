import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Order from './order.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Receipt extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare receiptNumber: string

  @column()
  declare printedBy: number

  @column.dateTime()
  declare printedAt: DateTime

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
