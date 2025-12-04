import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import MenuItem from '#models/menu_item'
import Session from '#models/session'
import Kot from '#models/kot'

export default class CustomerOrdersController {
  public async show({ params, response }: HttpContext) {
    const { sessionToken } = params

    const session = await Session.query()
      .where('sessionToken', sessionToken)
      .preload('orders', (ordersQuery) =>
        ordersQuery
          .preload('items', (itemsQuery) => itemsQuery.preload('menuItem'))
          .preload('table')
          .preload('payment')
      )
      .first()

    if (!session) {
      return response.status(404).json({ message: 'Session not found' })
    }

    return { session }
  }

  public async addItem({ params, request, response, inertia }: HttpContext) {
    const { sessionToken } = params
    const { menuItemId, qty } = request.only(['menuItemId', 'qty'])

    const session = await Session.query()
      .where('sessionToken', sessionToken)
      .preload('orders', async (o) => {
        await o.preload('payment')
      })
      .firstOrFail()

    let activeOrder = session.orders.find((order) => !order.payment?.id)

    if (!activeOrder) {
      return inertia.render('errors/bill_closed', { sessionToken })
    }

    const menuItem = await MenuItem.find(menuItemId)
    if (!menuItem) return response.notFound({ message: 'Menu item not found' })

    let orderItem = await OrderItem.query()
      .where('orderId', activeOrder.id)
      .andWhere('status', 'cart')
      .andWhere('menuItemId', menuItemId)
      .first()

    if (orderItem) {
      orderItem.quantity += qty
      await orderItem.save()
    } else {
      orderItem = await OrderItem.create({
        orderId: activeOrder.id,
        menuItemId,
        quantity: qty,
        price: menuItem.price,
        status: 'cart',
      })
    }

    await this.recalculate(activeOrder.id)

    return response.redirect().back()
  }

  public async createNewBill({ params }: HttpContext) {
    const { sessionToken } = params

    const session = await Session.findByOrFail('sessionToken', sessionToken)

    const newOrder = await Order.create({
      sessionId: session.id,
      tableId: session.tableId,
      status: 'pending',
      subtotal: 0,
      tax: 0,
      total: 0,
    })

    return { message: 'New bill created', order: newOrder }
  }

  public async updateQty({ params, request, response }: HttpContext) {
    const { sessionToken } = params
    const { itemId, qty } = request.only(['itemId', 'qty'])

    const session = await Session.query()
      .where('sessionToken', sessionToken)
      .preload('orders', async (o) => {
        await o.preload('payment')
      })
      .firstOrFail()

    const activeOrder = session.orders.find((o) => !o.payment?.id)
    if (!activeOrder) return response.notFound({ message: 'No active order' })

    const orderItem = await OrderItem.query()
      .where('id', itemId)
      .where('orderId', activeOrder.id)
      .first()

    if (!orderItem) return response.notFound({ message: 'Order item not found' })

    orderItem.quantity = qty
    await orderItem.save()
    await this.recalculate(activeOrder.id)

    return response.redirect().back()
  }

  public async deleteItem({ params, request, response }: HttpContext) {
    const { sessionToken } = params
    const { itemId } = request.only(['itemId'])

    const session = await Session.query()
      .where('sessionToken', sessionToken)
      .preload('orders', async (o) => {
        await o.preload('payment')
      })
      .firstOrFail()

    const activeOrder = session.orders.find((o) => !o.payment?.id)
    if (!activeOrder) return response.notFound({ message: 'No active order' })

    const orderItem = await OrderItem.query()
      .where('id', itemId)
      .where('orderId', activeOrder.id)
      .first()

    if (!orderItem) return response.notFound({ message: 'Order item not found' })

    await orderItem.delete()
    await this.recalculate(activeOrder.id)

    return response.redirect().back()
  }

  public async submit({ params, response }: HttpContext) {
    const { sessionToken } = params

    const session = await Session.query()
      .where('sessionToken', sessionToken)
      .preload('orders')
      .firstOrFail()

    const activeOrder = session.orders.find((o) => o.status === 'pending')
    if (!activeOrder) return response.notFound({ message: 'No order to submit' })

    activeOrder.status = 'pending'
    await activeOrder.save()

    return response.redirect().back()
  }

  public async placeOrder(ctx: HttpContext) {
    const { sessionToken } = ctx.params

    const session = await Session.query()
      .where('sessionToken', sessionToken)
      .preload('orders', async (o) => {
        await o.preload('payment')
      })
      .firstOrFail()

    let activeOrder = session.orders.find((order) => !order.payment?.id)

    const order = activeOrder

    // Ambil semua item CART
    let cartItems = await OrderItem.query()
      .where('order_id', activeOrder!.id)
      .andWhere('status', 'cart')

    if (cartItems.length === 0) {
      return { error: 'Cart kosong, tidak bisa order.' }
    }

    // Ubah status item → ordered
    await OrderItem.query()
      .where('order_id', activeOrder!.id)
      .andWhere('status', 'cart')
      .update({ status: 'ordered' })

    // Update status order
    order!.status = 'cooking'
    await order!.save()

    const kot: any = cartItems.map((i: any) => ({
      orderId: Number(activeOrder!.id),
      orderItemId: Number(i.id),
      kotNumber: `ORD-${Date.now()}`,
      section: 'kitchen',
      status: 'sent',
    }))
    await Kot.createMany(kot)

    return ctx.response.redirect().back()
  }

  private async recalculate(orderId: number) {
    const items = await OrderItem.query().where('orderId', orderId)

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    )
    const tax = subtotal * 0.1
    const total = subtotal + tax

    await Order.query().where('id', orderId).update({
      subtotal,
      tax,
      total,
    })
  }
}
