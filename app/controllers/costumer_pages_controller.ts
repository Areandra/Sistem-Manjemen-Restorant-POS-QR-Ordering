import Order from '#models/order'
import MenuItem from '#models/menu_item'
import OrderItem from '#models/order_item'
import { HttpContext } from '@adonisjs/core/http'

export default class CostumerPagesController {
  public async index({ params, inertia }: HttpContext) {
    const { sessionToken } = params

    const menuItems = await MenuItem.all()

    return inertia.render('costumer/index', {
      menuItems,
      sessionToken,
    })
  }

  public async cart({ params, inertia }: HttpContext) {
    const { sessionToken } = params

    const order = await Order.findByOrFail('session_token', sessionToken)

    const cartItems = await OrderItem.query()
      .where('order_id', order.id)
      .where('status', 'cart')
      .preload('menuItem')

    return inertia.render('customer/CartPage', {
      order,
      cartItems,
      sessionToken,
    })
  }

  public async order({ params, inertia }: HttpContext) {
    const { sessionToken } = params
    const order = await Order.findByOrFail('session_token', sessionToken)

    const orderedItems = await OrderItem.query()
      .where('order_id', order.id)
      .whereNot('status', 'cart')
      .preload('menuItem')

    return inertia.render('customer/ActiveOrderPage', {
      order,
      orderedItems,
      sessionToken,
    })
  }
}
