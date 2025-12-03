import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import MenuCategory from './menu_category.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class MenuItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare categoryId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare costOfGoods: number | null

  @column()
  declare imageUrl: string | null

  @column()
  declare isAvailable: boolean

  @column()
  declare sku: string | null

  @belongsTo(() => MenuCategory, { foreignKey: 'categoryId' })
  declare category: BelongsTo<typeof MenuCategory>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
