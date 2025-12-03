import { useState } from 'react'

interface PaymentPanelProps {
  order: any
  onPaid: (payment: any) => void
  onCancel?: () => void
}

export default function PaymentPanel({ order, onPaid, onCancel }: PaymentPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'e-wallet' | 'transfer'>(
    'cash'
  )
  const [amountPaid, setAmountPaid] = useState(order.total)
  const [loading, setLoading] = useState(false)

  const formatRp = (value: number | string) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value))

  const handlePay = async () => {
    setLoading(true)
    try {
      const res = await fetch('/cashier/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethod,
          amount: Number(amountPaid),
        }),
      })

      const data = await res.json()
      console.log('data', data)
      if (!res.ok) throw new Error(data.message || 'Payment failed')

      alert('Pembayaran berhasil! Kembalian: ' + formatRp(data.payment.change))
      onPaid(data)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-96 p-6 bg-white rounded shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Pembayaran</h2>

      {/* Ringkasan Order */}
      <div className="mb-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatRp(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Pajak</span>
          <span>{formatRp(order.tax)}</span>
        </div>
        {Number(order.discount) > 0 && (
          <div className="flex justify-between">
            <span>Diskon</span>
            <span>-{formatRp(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-2 border-t pt-2">
          <span>Total</span>
          <span>{formatRp(order.total)}</span>
        </div>
      </div>

      {/* Pilih metode pembayaran */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Metode Pembayaran</label>
        <select
          className="w-full border p-2 rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as any)}
        >
          <option value="cash">Cash</option>
          <option value="qris">QRIS</option>
          <option value="e-wallet">E-Wallet</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      {/* Input jumlah dibayar (untuk cash) */}
      {paymentMethod === 'cash' && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Jumlah Dibayar</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={amountPaid}
            onChange={(e) => setAmountPaid(Number(e.target.value))}
            min={order.total}
          />
          <p className="mt-1 text-sm text-gray-500">
            Kembalian: {formatRp(Math.max(amountPaid - order.total, 0))}
          </p>
        </div>
      )}

      {/* Tombol bayar */}
      <div className="flex space-x-2">
        <button
          onClick={handlePay}
          disabled={loading}
          className="flex-1 bg-orange-600 text-white py-2 rounded font-semibold"
        >
          {loading ? 'Memproses...' : 'Bayar'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 py-2 rounded font-semibold"
          >
            Batal
          </button>
        )}
      </div>
    </div>
  )
}
