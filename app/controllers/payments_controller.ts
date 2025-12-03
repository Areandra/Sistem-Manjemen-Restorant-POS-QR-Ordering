import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import Order from '#models/order'
import Receipt from '#models/receipt'
import { DateTime } from 'luxon'

export default class PaymentsController {
  public async create({ request, response, auth }: HttpContext) {
    const { orderId, paymentMethod, amount } = request.only(['orderId', 'paymentMethod', 'amount'])

    if (!orderId || !paymentMethod || !amount) {
      return response.badRequest({
        message: 'orderId, paymentMethod, dan amount wajib diisi',
      })
    }

    const order = await Order.find(orderId)
    if (!order) {
      return response.notFound({ message: 'Order tidak ditemukan' })
    }

    // Cek kalau sudah ada payment
    const existingPayment = await Payment.query().where('order_id', orderId).first()
    if (existingPayment) {
      return response.badRequest({
        message: 'Order sudah dibayar.',
        existingPayment,
      })
    }

    // Hitung kembalian
    const change = Number(amount) - Number(order.total)
    const safeChange = change > 0 ? change : 0

    // Buat payment
    const payment = await Payment.create({
      orderId,
      paymentMethod,
      amount,
      change: safeChange,
      status: 'paid',
    })

    // =============== GENERATE RECEIPT ===============
    const receiptNumber = 'RC-' + DateTime.now().toFormat('yyyyMMdd-HHmmss') + '-' + orderId

    const printedBy = auth.user?.id ?? 0

    const receipt = await Receipt.create({
      orderId,
      receiptNumber,
      printedBy,
      printedAt: DateTime.now(),
    })
    // =================================================

    await receipt.load('printedByUser')

    return response.ok({
      message: 'Pembayaran berhasil dicatat.',
      payment,
      receipt,
    })
  }
}
