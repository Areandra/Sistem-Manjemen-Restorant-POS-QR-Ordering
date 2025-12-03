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

  public async cart({ params, inertia, response }: HttpContext) {
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
    // return response.ok({
    //   session,
    // })

    // return response.ok({
    //   data: session,
    // })

    return inertia.render('costumer/cart', {
      data: session,
    })
  }

  // public async show({ params }: HttpContext) {
  //   const id = params.id

  //   const order = await Order.query()
  //     .where('id', id)
  //     .whereNot('status', 'completed')
  //     .preload('items', (q) => q.preload('menuItem'))
  //     .preload('table')
  //     .preload('createdByUser')
  //     .preload('payment')
  //     .preload('session')
  //     .first()

  //   return order
  // }

  public async order({ params, inertia }: HttpContext) {
    const { sessionToken } = params
    // const order = await Order.findByOrFail('session_token', sessionToken)

    const session = await Session.findByOrFail('session_token', sessionToken)

    await session.load(
      'orders',
      async (e) =>
        await e
          .preload('items', async (q) => await q.whereNot('status', 'cart').preload('menuItem'))
          .preload('payment')
          .preload('session')
    )

    await session.load('table')

    // const orderedItems = await OrderItem.query()
    //   .where('order_id', order.id)
    //   .whereNot('status', 'cart')
    //   .preload('menuItem')
    // return {
    //   data: session,
    // }
    return inertia.render('costumer/order', {
      data: session,
    })
  }
}
