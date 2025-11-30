import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Inventory from './inventory.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class InventoryLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare inventoryId: number

  @column()
  declare change: number

  @column()
  declare type: 'in' | 'out' | 'adjustment'

  @column()
  declare reference: string | null

  @belongsTo(() => Inventory)
  declare inventory: BelongsTo<typeof Inventory>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
