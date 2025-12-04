import type { HttpContext } from '@adonisjs/core/http'
import Table from '#models/table'
import Session from '#models/session'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import MenuItem from '#models/menu_item'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'
import Kot from '#models/kot'

export default class OrdersController {
  public async start(ctx: HttpContext) {
    if (ctx.request.method() === 'GET') {
      const data = await Table.query()
        .where((query) => {
          query.whereNull('currentSessionId').orWhereHas('session', (q) => {
            q.where('isActive', 1)
          })
        })
        .preload('session', (q) => {
          q.where('isActive', 1)
        })
        .preload('orders', async (q) => {
          await q.preload('payment')
        })

      return ctx.inertia.render('cashier/start', { data })
    }

    const tableId = ctx.request.input('table_id')
    const table = await Table.findOrFail(tableId)

    if (!ctx.auth.user?.id) {
      return ctx.response.redirect('/login')
    }

    let session = null

    if (table.currentSessionId) {
      session = await Session.find(table.currentSessionId)

      if (session && session.isActive) {
        const activeOrder = await Order.query()
          .where('sessionId', session.id)
          .preload('payment')
          .first()
        if (activeOrder!.payment.id) {
          return ctx.response.redirect('/cashier/order')
        }

        await Order.create({
          tableId,
          sessionId: session.id,
          orderCode: `ORD-${Date.now()}`,
          type: 'dine_in',
          status: 'pending',
          subtotal: 0,
          tax: 0,
          discount: 0,
          total: 0,
        })
        return ctx.response.redirect('/cashier/order')
      }
    }

    session = await Session.create({
      tableId,
      sessionToken: crypto.randomUUID(),
      isActive: true,
      createdBy: ctx.auth.user!.id,
    })

    table.status = 'occupied'
    table.currentSessionId = session.id
    await table.save()

    await Order.create({
      tableId,
      sessionId: session.id,
      orderCode: `ORD-${Date.now()}`,
      type: 'dine_in',
      status: 'pending',
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    })

    return ctx.response.redirect('/cashier/order')
  }

  public async endSession({ params, response }: HttpContext) {
    const session = await Session.findBy('sessionToken', params.sessionToken)

    if (session) {
      const table = await Table.findBy('currentSessionId', session.id)

      table!.currentSessionId = null

      await table!.save()

      session.isActive = false
      await session.save()
    }

    return response.redirect('back')
  }

  public async show({ params }: HttpContext) {
    const id = params.id

    const order = await Order.query()
      .where('id', id)
      .whereNot('status', 'completed')
      .preload('items', (q) => q.preload('menuItem'))
      .preload('table')
      .preload('payment')
      .preload('session', async (s) => {
        await s.preload('createdByUser')
      })
      .first()

    return order
  }

  public async addItem(ctx: HttpContext) {
    const { order_id, menu_item_id, qty } = ctx.request.body()

    const order = await Order.findOrFail(order_id)

    await order.load('payment')

    if (order.payment?.id)
      return {
        messege: 'Order Closed',
      }

    const menu = await MenuItem.findOrFail(menu_item_id)

    let existingItem = await OrderItem.query()
      .where('order_id', order_id)
      .andWhere('status', 'cart')
      .andWhere('menu_item_id', menu_item_id)
      .first()

    if (existingItem) {
      existingItem.quantity++
      existingItem.subtotal = existingItem.quantity * menu.price
      await existingItem.save()
      await this.recalculateOrder(order_id)
      return existingItem
    }

    const item = await OrderItem.create({
      orderId: order_id,
      menuItemId: menu_item_id,
      quantity: qty ?? 1,
      price: menu.price,
      subtotal: (qty ?? 1) * menu.price,
      status: 'cart',
    })

    await this.recalculateOrder(order_id)
    return item
  }

  public async updateQty(ctx: HttpContext) {
    const { item_id, qty } = ctx.request.body()

    const item = await OrderItem.query()
      .where('id', item_id)
      .andWhere('status', 'cart')
      .firstOrFail()

    item.quantity = qty
    item.subtotal = qty * item.price

    await item.save()
    await this.recalculateOrder(item.orderId)

    return item
  }

  public async deleteItem(ctx: HttpContext) {
    const { item_id } = ctx.request.body()

    const item = await OrderItem.query()
      .where('id', item_id)
      .andWhere('status', 'cart')
      .firstOrFail()
    const orderId = item.orderId

    await item.delete()
    await this.recalculateOrder(orderId)

    return { deleted: true }
  }

  public async placeOrder(ctx: HttpContext) {
    const orderId = ctx.params.id

    const order = await Order.findOrFail(orderId)

    let cartItems = await OrderItem.query().where('order_id', orderId).andWhere('status', 'cart')

    if (cartItems.length === 0) {
      return { error: 'Cart kosong, tidak bisa order.' }
    }

    await OrderItem.query()
      .where('order_id', orderId)
      .andWhere('status', 'cart')
      .update({ status: 'ordered' })

    order.status = 'cooking'
    await order.save()

    const kot: Partial<Kot>[] = cartItems.map((i: any) => ({
      orderId: Number(orderId),
      orderItemId: Number(i.id),
      kotNumber: `ORD-${Date.now()}`,
      section: 'kitchen',
      status: 'sent',
    }))
    await Kot.createMany(kot)

    return { status: true, message: 'Order dikirim ke dapur.' }
  }

  public async pay(ctx: HttpContext) {
    const orderId = ctx.params.id

    const order = await Order.findOrFail(orderId)
    const table = await Table.findOrFail(order.tableId)
    const session = await Session.findOrFail(table.currentSessionId)

    order.status = 'completed'
    await order.save()

    session.isActive = false
    session.endedAt = DateTime.now()
    await session.save()

    table.status = 'available'
    table.currentSessionId = null
    await table.save()

    return { status: 'paid' }
  }

  private async recalculateOrder(orderId: number) {
    const order = await Order.findOrFail(orderId)
    const items = await OrderItem.query().where('order_id', orderId)

    const subtotal = items.reduce((acc, it) => acc + Number(it.subtotal), 0)
    const tax = subtotal * 0.1
    const discount = 0
    const total = subtotal + tax - discount

    order.subtotal = subtotal
    order.tax = tax
    order.discount = discount
    order.total = total

    await order.save()
  }

  public async updateItemStatus({ request, params, response }: HttpContext) {
    const item = await OrderItem.findOrFail(params.id)
    item.status = request.input('status')
    await item.save()

    const kot = await Kot.query().where('orderItemId', item.id).first()
    if (kot) {
      await this.reCheckKotStatus(kot)
    }

    return response.json({ success: true })
  }

  private async reCheckKotStatus(kot: Kot) {
    const item = await kot.related('orderItem').query().first()
    if (!item) return

    if (item.status === 'delivered') {
      kot.status = 'done'
    } else if (item.status === 'cooking' || item.status === 'ready') {
      kot.status = 'processing'
    } else {
      kot.status = 'sent'
    }
    await kot.save()

    await this.reCheckOrderStatus(kot.orderId)
  }

  private async reCheckOrderStatus(orderId: number) {
    const kots = await Kot.query().where('orderId', orderId)
    const order = await Order.findOrFail(orderId)

    const statuses = kots.map((k) => k.status)

    if (statuses.every((s) => s === 'done')) {
      order.status = 'served'
    } else if (statuses.some((s) => s === 'processing')) {
      order.status = 'cooking'
    } else {
      order.status = 'pending'
    }

    await order.save()
  }
}
