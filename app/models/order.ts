import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Table from './table.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import OrderItem from './order_item.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tableId: number

  @column()
  declare orderCode: string

  @column()
  declare type: 'dine_in' | 'takeaway' | 'qr_order'

  @column()
  declare status: 'pending' | 'cooking' | 'served' | 'completed' | 'cancelled'

  @column()
  declare subtotal: number

  @column()
  declare tax: number

  @column()
  declare discount: number

  @column()
  declare total: number

  @column()
  declare notes: string | null

  @column()
  declare createdBy: number

  @belongsTo(() => Table)
  declare table: BelongsTo<typeof Table>

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
