export default function RecieptModal({ receipt, order, onClose }: any) {
  const formatRp = (v: any) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v)

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString))

  const handlePrint = () => {
    const content = document.getElementById('print-area')!.innerHTML
    const printWindow = window.open('', '', 'width=400,height=600')
    printWindow!.document.write(content)
    printWindow!.document.close()
    printWindow!.print()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-80 rounded shadow-lg p-4">
        <div id="print-area">
          <h2 className="text-center font-bold">STRUK PEMBAYARAN</h2>
          <p className="text-center text-sm">{receipt.receiptNumber}</p>
          <hr className="my-2" />

          <p>Meja: {order.table?.tableNumber}</p>
          <p>Kasir: {receipt.printedByUser.name}</p>
          <p>Tanggal: {formatDate(receipt.printedAt)}</p>

          <hr className="my-2" />

          {order.items.map((i: any) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span>
                {i.menuItem.name} x {i.quantity}
              </span>
              <span>{formatRp(i.quantity * i.price)}</span>
            </div>
          ))}

          <hr className="my-2" />

          <div className="flex justify-between">
            <span className="font-semibold">Subtotal</span>
            <span>{formatRp(order.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Pajak</span>
            <span>{formatRp(order.tax)}</span>
          </div>

          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-bold">{formatRp(order.total)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button onClick={handlePrint} className="w-full bg-orange-600 text-white py-2 rounded">
            Print
          </button>

          <button onClick={onClose} className="w-full bg-gray-300 py-2 rounded">
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
