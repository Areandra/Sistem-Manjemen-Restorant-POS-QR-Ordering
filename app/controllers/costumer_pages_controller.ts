import MenuItem from '#models/menu_item'
import { HttpContext } from '@adonisjs/core/http'
import Session from '#models/session'
import MenuCategory from '#models/menu_category'

export default class CostumerPagesController {
  public async index({ params, inertia }: HttpContext) {
    const { sessionToken } = params

    const menuItems = await MenuItem.all()
    const category = await MenuCategory.query()

    return inertia.render('costumer/index', {
      menuItems,
      sessionToken,
      category,
    })
  }

  async showByCategories(ctx: HttpContext) {
    const { sessionToken, id } = ctx.params
    const data = await MenuCategory.findOrFail(id)
    await data.load('items')
    const category = await MenuCategory.query()

    return ctx.inertia.render('costumer/index', {
      menuItems: data.items,
      category,
      sessionToken,
    })
  }

  public async cart({ params, inertia }: HttpContext) {
    const { sessionToken } = params

    const session = await Session.findByOrFail('session_token', sessionToken)

    await session.load(
      'orders',
      async (e) =>
        await e
          .preload('items', async (q) => await q.preload('menuItem'))
          .preload('table')
          .preload('payment')
          .preload('session')
    )

    return inertia.render('costumer/cart', {
      data: session,
    })
  }

  public async order({ params, inertia }: HttpContext) {
    const { sessionToken } = params

    const session = await Session.findByOrFail('session_token', sessionToken)

    await session.load('orders', (query) => {
      query
        .where('sessionId', session.id)
        .preload('items', (q) => q.whereNot('status', 'cart').preload('menuItem'))
        .preload('payment')
    })

    await session.load('table')

    return inertia.render('costumer/order', {
      data: session,
    })
  }
}
