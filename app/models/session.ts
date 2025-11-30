import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Table from './table.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tableId: number

  @column()
  declare sessionToken: string

  @column.dateTime({ autoCreate: true })
  declare startedAt: DateTime

  @column.dateTime()
  declare endedAt: DateTime | null

  @column()
  declare isActive: boolean

  @belongsTo(() => Table)
  declare table: BelongsTo<typeof Table>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
