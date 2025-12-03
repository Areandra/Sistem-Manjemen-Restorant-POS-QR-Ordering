import Kot from '#models/kot'
import MenuCategory from '#models/menu_category'
import type { HttpContext } from '@adonisjs/core/http'

export default class KitchensController {
  public async index(ctx: HttpContext) {
    const category = await MenuCategory.query()
    const kots = await Kot.query()
      .preload('orderItem', (q) =>
        q.whereNotIn('status', ['cart']).preload('menuItem', (m) => m.preload('category'))
      )
      .preload('order', (o) => {
        o.preload('table')
      })
    return ctx.inertia.render('kitchen/index', {
      kots,
      category,
    })
    return { kots, category }
  }

  async show(ctx: HttpContext) {
    const id = Number(ctx.params.id)

    const category = await MenuCategory.query()

    const kots = await Kot.query()
      .preload('order', (o) => {
        o.preload('table')
      })
      .preload('orderItem', (q) => {
        q.whereNotIn('status', ['cart'])
          .whereHas('menuItem', (m) => {
            m.where('categoryId', id)
          })
          .preload('menuItem', (m) => {
            m.preload('category')
          })
      })

    return ctx.inertia.render('kitchen/index', {
      kots,
      category,
    })
  }

  public async updateKotStatus({ request, params, response }: HttpContext) {
    const kot = await Kot.findOrFail(params.id)
    kot.status = request.input('status')
    await kot.save()

    return response.json({ success: true, status: kot.status })
  }
}
