// app/controllers/order_controller.ts
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
  /**
   * START SESSION + CREATE ORDER
   * Digunakan saat kasir memilih meja
   */
  public async start(ctx: HttpContext) {
    if (ctx.request.method() === 'GET') {
      const data = await Table.query()
      return ctx.inertia.render('cashier/start', { data })
    }

    const tableId = ctx.request.input('table_id')
    const table = await Table.findOrFail(tableId)

    if (!ctx.auth.user?.id) {
      return ctx.response.redirect('/login')
    }

    let session = null

    // ==== CEK SESSION AKTIF ====
    if (table.currentSessionId) {
      session = await Session.find(table.currentSessionId)

      // Gunakan session hanya jika masih aktif
      if (session && session.isActive) {
        // Tidak cek order, langsung buat order baru
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

        // return {
        //   status: 'existing-session',
        //   session,
        //   order,
        // }
      }
    }

    // ==== TIDAK ADA SESSION → BUAT SESSION BARU ====
    session = await Session.create({
      tableId,
      sessionToken: crypto.randomUUID(),
      isActive: true,
      createdBy: ctx.auth.user!.id,
    })

    // Update table agar session aktif terikat
    table.status = 'occupied'
    table.currentSessionId = session.id
    await table.save()

    // ==== BUAT ORDER BARU ====
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
    // return {
    //   status: 'new-session',
    //   session,
    //   order,
    // }
  }

  // public async index(ctx: HttpContext) {
  //   const page = ctx.request.input('page', 1)
  //   const category = await MenuCategory.query()

  //   const orders = await Order.query()
  //     .preload('items', (q) =>
  //       q
  //         .where('status', 'ordered')
  //         .andWhere('status', 'cooking')
  //         .preload('menuItem', (m) => m.preload('category'))
  //     )
  //     .preload('table')
  //     .preload('createdByUser')
  //     .paginate(page)

  //   return ctx.inertia.render('kitchen/index', {
  //     orders,
  //     category,
  //   })

  //   return { orders, category }
  // }

  /**
   * GET ORDER ACTIVE BY TABLE ID
   */
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

  /**
   * ADD ITEM KE ORDER
   */
  public async addItem(ctx: HttpContext) {
    const { order_id, menu_item_id, qty } = ctx.request.body()

    const order = await Order.findOrFail(order_id)

    await order.load('payment')

    if (order.payment?.id)
      return {
        messege: 'Order Closed',
      }

    // pastikan menu ada
    const menu = await MenuItem.findOrFail(menu_item_id)

    // cek apakah item sudah ada di order
    let existingItem = await OrderItem.query()
      .where('order_id', order_id)
      .andWhere('status', 'cart')
      .andWhere('menu_item_id', menu_item_id)
      .first()

    if (existingItem) {
      // update quantity dan subtotal
      existingItem.quantity++
      existingItem.subtotal = existingItem.quantity * menu.price
      await existingItem.save()
      await this.recalculateOrder(order_id)
      return existingItem
    }

    // buat baru kalau belum ada
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

  /**
   * UPDATE QTY
   */
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

  /**
   * DELETE ITEM
   */
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

    // Ambil semua item CART
    let cartItems = await OrderItem.query().where('order_id', orderId).andWhere('status', 'cart')

    if (cartItems.length === 0) {
      return { error: 'Cart kosong, tidak bisa order.' }
    }

    // Ubah status item → ordered
    await OrderItem.query()
      .where('order_id', orderId)
      .andWhere('status', 'cart')
      .update({ status: 'ordered' })

    // Update status order
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

  /**
   * PAYMENT
   */
  public async pay(ctx: HttpContext) {
    const orderId = ctx.params.id

    const order = await Order.findOrFail(orderId)
    const table = await Table.findOrFail(order.tableId)
    const session = await Session.findOrFail(table.currentSessionId)

    // Order selesai
    order.status = 'completed'
    await order.save()

    // Sesi tutup
    session.isActive = false
    session.endedAt = DateTime.now()
    await session.save()

    // Table kembali available
    table.status = 'available'
    table.currentSessionId = null
    await table.save()

    return { status: 'paid' }
  }

  /**
   * PRIVATE — HITUNG TOTAL ORDER (subtotal, tax, discount, total)
   */
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

    // Hanya cek Kot yang terkait dengan item ini
    const kot = await Kot.query().where('orderItemId', item.id).first()
    if (kot) {
      await this.reCheckKotStatus(kot)
    }

    return response.json({ success: true })
  }

  // ===================== LOGIKA =====================

  private async reCheckKotStatus(kot: Kot) {
    const item = await kot.related('orderItem').query().first()
    if (!item) return

    // Update Kot sesuai OrderItem
    if (item.status === 'delivered') {
      kot.status = 'done'
    } else if (item.status === 'cooking' || item.status === 'ready') {
      kot.status = 'processing'
    } else {
      kot.status = 'sent'
    }
    await kot.save()

    // Update Order terkait
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
