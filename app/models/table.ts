import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Order from './order.js'

export default class Table extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tableNumber: string

  @column()
  declare capacity: number

  @column()
  declare qrCode: string

  @column()
  declare status: 'available' | 'occupied' | 'waiting_payment'

  @column()
  declare currentSessionId: number | null

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
