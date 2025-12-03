// app/controllers/customer_orders_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import MenuItem from '#models/menu_item'

export default class CostumersController {
  /**
   * Ambil order berdasarkan session token
   */
  public async show({ params, response }: HttpContext) {
    const { sessionToken } = params

    const order = await Order.query()
      .where('session_token', sessionToken)
      .preload('items', (q) => q.preload('menuItem'))
      .preload('table')
      .first()

    if (!order) {
      return response.status(404).json({ message: 'Session tidak ditemukan' })
    }

    return {
      order,
    }
  }

  /**
   * Tambah item ke order customer
   */
  public async addItem({ params, request, response }: HttpContext) {
    const { sessionToken } = params
    const { menuItemId, qty } = request.only(['menuItemId', 'qty'])

    const order = await Order.findBy('session_token', sessionToken)
    if (!order) {
      return response.status(404).json({ message: 'Session tidak valid' })
    }

    const menuItem = await MenuItem.find(menuItemId)
    if (!menuItem) {
      return response.status(404).json({ message: 'Menu item tidak ditemukan' })
    }

    // cek apakah item sudah ada di order
    let orderItem = await OrderItem.query()
      .where('order_id', order.id)
      .where('menu_item_id', menuItemId)
      .first()

    if (orderItem) {
      orderItem.quantity += qty
      await orderItem.save()
    } else {
      orderItem = await OrderItem.create({
        orderId: order.id,
        menuItemId,
        quantity: qty,
        price: menuItem.price,
      })
    }

    await this.recalculate(order.id)

    return {
      message: 'Item ditambahkan',
      item: orderItem,
    }
  }

  /**
   * Update qty item customer
   */
  public async updateQty({ params, request, response }: HttpContext) {
    const { sessionToken } = params
    const { itemId, qty } = request.only(['itemId', 'qty'])

    const order = await Order.findBy('session_token', sessionToken)
    if (!order) {
      return response.status(404).json({ message: 'Session tidak valid' })
    }

    const orderItem = await OrderItem.query()
      .where('id', itemId)
      .where('order_id', order.id)
      .first()

    if (!orderItem) {
      return response.status(404).json({ message: 'Item tidak ditemukan' })
    }

    orderItem.quantity = qty
    await orderItem.save()

    await this.recalculate(order.id)

    return {
      message: 'Quantity diperbarui',
      item: orderItem,
    }
  }

  /**
   * Hapus item dalam order customer
   */
  public async deleteItem({ params, request, response }: HttpContext) {
    const { sessionToken } = params
    const { itemId } = request.only(['itemId'])

    const order = await Order.findBy('session_token', sessionToken)
    if (!order) {
      return response.status(404).json({ message: 'Session tidak valid' })
    }

    const orderItem = await OrderItem.query()
      .where('id', itemId)
      .where('order_id', order.id)
      .first()

    if (!orderItem) {
      return response.status(404).json({ message: 'Item tidak ditemukan' })
    }

    await orderItem.delete()

    await this.recalculate(order.id)

    return { message: 'Item dihapus' }
  }

  /**
   * Customer submit order (checkout)
   */
  public async submit({ params, response }: HttpContext) {
    const { sessionToken } = params

    const order = await Order.findBy('session_token', sessionToken)
    if (!order) {
      return response.status(404).json({ message: 'Session tidak valid' })
    }

    order.status = 'pending' // menunggu cashier
    await order.save()

    return { message: 'Order berhasil dikirim ke kasir', order }
  }

  /**
   * Recalculate subtotal, tax, total
   */
  private async recalculate(orderId: number) {
    const items = await OrderItem.query().where('order_id', orderId)

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const tax = subtotal * 0.1
    const total = subtotal + tax

    await Order.query().where('id', orderId).update({
      subtotal,
      tax,
      total,
    })
  }
}
