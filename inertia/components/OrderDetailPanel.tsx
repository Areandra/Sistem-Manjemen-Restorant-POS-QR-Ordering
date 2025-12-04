import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
import PaymentPanel from './PaymentPanel'
import RecieptModal from './RecieptModal'
import QRCodeToCanvas from './QrCodeToCanvas'

export default function OrderDetailPanel({ order, updateItemQty, delItem, orderAll }: any) {
  if (!order) return null
  const [showPayment, setShowPayment] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)
  const [showQR, setShowQR] = useState(false)

  const isPaid = !!order.payment

  const STATUS_LIST = ['cart', 'ordered', 'cooking', 'ready', 'delivered'] as const

  const STATUS_COLOR: any = {
    cart: 'orange',
    ordered: 'blue',
    cooking: 'yellow',
    ready: 'green',
    delivered: 'gray',
  }

  const ItemList = ({ status }: { status: string }) => {
    const list = items.filter((i: any) => i.status === status)
    if (list.length === 0) return null

    const color = STATUS_COLOR[status]

    return (
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <span
            className={`px-2 py-1 bg-${color}-100 text-${color}-700 rounded capitalize font-medium`}
          >
            {status}
          </span>
        </div>

        {list.map((item: any) => (
          <div key={item.id} className="flex-column p-3 rounded border shadow-sm mb-2">
            <div className="flex justify-between items-center bg-white">
              <div>
                <p className="font-medium text-gray-800">{item.menuItem.name}</p>
                <p className="text-gray-600 text-sm">
                  {item.quantity} × {formatRp(item.price)}
                </p>
              </div>
              <span className="font-semibold">{formatRp(item.quantity * item.price)}</span>
            </div>

            {status === 'cart' && !isPaid && (
              <div className="flex row space-x-3 h-7 mt-4">
                <button
                  onClick={() => item.quantity > 1 && updateItemQty(item.id, --item.quantity)}
                  className="w-full bg-orange-600 text-white rounded-lg font-semibold"
                >
                  -
                </button>

                <button
                  onClick={() => updateItemQty(item.id, ++item.quantity)}
                  className="w-full bg-orange-600 text-white rounded-lg font-semibold"
                >
                  +
                </button>

                <button
                  onClick={() => delItem(item.id)}
                  className="flex w-full justify-center bg-orange-600 items-center text-white rounded-lg font-semibold"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const table = order.table
  const items = order.items || []

  const formatRp = (value: number | string) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value))

  return (
    <>
      <aside className="w-80 h-screen border-l bg-white flex flex-col shadow-xl z-50 flex-shrink-0 pb-16">
        <h2 className="font-semibold p-4 border-b text-lg">Order Details</h2>

        <div className="p-4 border-b bg-gray-50">
          <p className="font-semibold text-gray-800">Meja: {table?.tableNumber}</p>
          <p className="text-gray-600 text-sm">Kapasitas: {table?.capacity}</p>

          <p className="text-gray-600 text-sm capitalize">
            Status:{' '}
            {isPaid ? (
              <span className="text-green-600 font-semibold">Paid</span>
            ) : (
              <span className="text-red-600 font-semibold">Belum Bayar</span>
            )}
          </p>

          <p className="text-gray-600 text-sm">
            Order ID: <span className="font-medium">{order.orderCode}</span>
          </p>

          <p className="text-gray-600 text-sm">
            Created By: <span className="font-medium">{order.session?.createdByUser.name}</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada item.</p>
          ) : (
            <>
              {STATUS_LIST.map((s) => (
                <ItemList key={s} status={s} />
              ))}
            </>
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex justify-between mb-1 text-sm">
            <span>Subtotal</span>
            <span>{formatRp(order.subtotal)}</span>
          </div>

          <div className="flex justify-between mb-1 text-sm">
            <span>Pajak</span>
            <span>{formatRp(order.tax)}</span>
          </div>

          {Number(order.discount) > 0 && (
            <div className="flex justify-between mb-1 text-sm">
              <span>Diskon</span>
              <span>-{formatRp(order.discount)}</span>
            </div>
          )}

          <div className="flex justify-between mt-3 mb-3 border-t pt-3">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">{formatRp(order.total)}</span>
          </div>

          <button
            onClick={() => setShowQR(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mb-3"
          >
            QR Code
          </button>

          <button
            onClick={() => orderAll(order.id)}
            className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold mb-3"
            disabled={isPaid}
          >
            Order
          </button>

          {!isPaid && (
            <button
              onClick={() => setShowPayment(true)}
              className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold"
            >
              Bayar
            </button>
          )}

          {isPaid && (
            <div className="w-full text-center py-2 rounded-lg font-semibold text-green-700 border border-green-600">
              Sudah Dibayar
            </div>
          )}
        </div>
      </aside>

      {showPayment && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <PaymentPanel
            order={order}
            onPaid={(res) => {
              setShowPayment(false)
              setReceiptData(res)
            }}
            onCancel={() => setShowPayment(false)}
          />
        </div>
      )}
      {receiptData && (
        <RecieptModal
          receipt={receiptData.receipt}
          order={order}
          onClose={() => setReceiptData(null)}
        />
      )}
      {showQR && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Session QR Code</h3>

            <div className="text-sm text-gray-700 mb-4">
              <p>
                <span className="font-semibold">Meja:</span> {`Meja ${table?.tableNumber}`}
              </p>
              <p>
                <span className="font-semibold">Session Token:</span> {order.session.sessionToken}
              </p>
              <p>
                <span className="font-semibold">Dibuat pada:</span>{' '}
                {new Date(order.session.createdAt).toLocaleString('id-ID')}
              </p>
            </div>

            <QRCodeToCanvas
              value={order.session.sessionToken}
              size={220}
              level="M"
              includeMargin={false}
              className="mx-auto"
            />

            <button
              onClick={() => {
                const printWindow = window.open('', '', 'width=350,height=500')

                const tableName = `Meja ${table?.tableNumber}`
                const createdAt = new Date(order.session.createdAt).toLocaleString('id-ID')

                printWindow!.document.write(`
          <html>
            <body style="font-family: sans-serif; text-align: center; padding: 16px;">

              <h2 style="margin-bottom: 6px;">QR Session</h2>

              <div style="margin-bottom: 12px; font-size: 14px; text-align:left;">
                <p><strong>Meja:</strong> ${tableName}</p>
                <p><strong>Session Token:</strong> ${order.session.sessionToken}</p>
                <p><strong>Dibuat pada:</strong> ${createdAt}</p>
              </div>

              <img id="qrImg" style="width:220px; margin-top:10px;" />

              <script>
                window.onload = function() { window.print(); }
              </script>

            </body>
          </html>
        `)

                const canvas = document.querySelector('#qr-canvas') as HTMLCanvasElement
                const imgData = canvas.toDataURL('image/png')

                setTimeout(() => {
                  const qrImg = printWindow!.document.getElementById('qrImg')
                  qrImg!.setAttribute('src', imgData)
                }, 200)
              }}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
            >
              Print QR
            </button>

            <button
              onClick={() => setShowQR(false)}
              className="mt-3 w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  )
}
