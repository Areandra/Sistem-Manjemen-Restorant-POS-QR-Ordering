// Flow order-item
export function nextOrderItemStatus(current: string) {
  const flow = ['cart', 'ordered', 'cooking', 'ready', 'delivered']
  const index = flow.indexOf(current)
  return flow[index + 1] || current
}

// Flow KOT
export function nextKotStatus(current: string) {
  const flow = ['sent', 'viewed', 'processing', 'done']
  const index = flow.indexOf(current)
  return flow[index + 1] || current
}
