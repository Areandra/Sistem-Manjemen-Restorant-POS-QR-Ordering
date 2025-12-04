import OrderItem from '#models/order_item'
import Payment from '#models/payment'
import Receipt from '#models/receipt'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import MenuItem from '#models/menu_item'

export default class DashboardController {
  private async generateRevenueChart() {
    const chart = new ChartJSNodeCanvas({ width: 1000, height: 600 })
    const labels: string[] = []
    const values: number[] = []

    for (let i = 29; i >= 0; i--) {
      const date = DateTime.now().minus({ days: i })

      const start = date.startOf('day').toSQL()
      const end = date.endOf('day').toSQL()

      const payments = await Payment.query()
        .whereBetween('createdAt', [start, end])
        .select('amount')

      const total = payments.reduce((s, x) => s + Number(x.amount), 0)

      labels.push(date.toFormat('dd LLL'))
      values.push(total)
    }

    const buffer = await chart.renderToBuffer({
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: values,
            backgroundColor: '#ff9900aa',
            borderColor: '#ff9900',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: 'Income 30 Hari Terakhir',
            color: '#000',
            font: { size: 20, weight: 'bold' },
          },
        },
        scales: {
          x: {
            ticks: { color: '#000', font: { size: 12 } },
            grid: { color: '#e0e0e0' },
          },
          y: {
            ticks: { color: '#000', font: { size: 12 } },
            grid: { color: '#e0e0e0' },
          },
        },
      },
    })

    return buffer.toString('base64')
  }

  private async getSummaryData() {
    const now = DateTime.now()

    const startThisMonth = now.startOf('month').toSQL()
    const endThisMonth = now.endOf('month').toSQL()
    const startLastMonth = now.minus({ months: 1 }).startOf('month').toSQL()
    const endLastMonth = now.minus({ months: 1 }).endOf('month').toSQL()

    const ordersThis = await OrderItem.query()
      .whereBetween('createdAt', [startThisMonth, endThisMonth])
      .select('quantity')

    const ordersLast = await OrderItem.query()
      .whereBetween('createdAt', [startLastMonth, endLastMonth])
      .select('quantity')

    const totalOrderThis = ordersThis.reduce((s, x) => s + Number(x.quantity), 0)
    const totalOrderLast = ordersLast.reduce((s, x) => s + Number(x.quantity), 0)

    const customersThis = await Receipt.query()
      .whereBetween('createdAt', [startThisMonth, endThisMonth])
      .count('* as total')

    const customersLast = await Receipt.query()
      .whereBetween('createdAt', [startLastMonth, endLastMonth])
      .count('* as total')

    const totalCustomerThis = Number(customersThis[0].$extras.total)
    const totalCustomerLast = Number(customersLast[0].$extras.total)

    const paymentsThis = await Payment.query()
      .whereBetween('createdAt', [startThisMonth, endThisMonth])
      .select('amount')

    const paymentsLast = await Payment.query()
      .whereBetween('createdAt', [startLastMonth, endLastMonth])
      .select('amount')

    const totalRevenueThis = paymentsThis.reduce((s, x) => s + Number(x.amount), 0)
    const totalRevenueLast = paymentsLast.reduce((s, x) => s + Number(x.amount), 0)

    const calculate = (thisValue: number, lastValue: number) => {
      if (lastValue === 0) {
        if (thisValue > 0) return '>100%'
        return '0%'
      }

      const growth = ((thisValue - lastValue) / lastValue) * 100
      return `${growth.toFixed(2)}%`
    }

    return [
      {
        icon: '📦',
        title: 'Total Orders',
        value: totalOrderThis,
        change: calculate(totalOrderThis, totalOrderLast),
        isPositive: totalOrderThis >= totalOrderLast,
      },
      {
        icon: '👤',
        title: 'Total Customer',
        value: totalCustomerThis,
        change: calculate(totalCustomerThis, totalCustomerLast),
        isPositive: totalCustomerThis >= totalCustomerLast,
      },
      {
        icon: '💰',
        title: 'Total Revenue',
        value: totalRevenueThis,
        change: calculate(totalRevenueThis, totalRevenueLast),
        isPositive: totalRevenueThis >= totalRevenueLast,
      },
    ]
  }

  private async getFavMenu() {
    const orders = await OrderItem.query().preload(
      'menuItem',
      async (i: any) => await i.preload('category')
    )
    const menuCount: Record<number, { menu: MenuItem; quantity: number }> = {}

    orders.forEach((item) => {
      const menu = item.menuItem
      if (!menu) return

      if (!menuCount[menu.id]) {
        menuCount[menu.id] = { menu, quantity: Number(item.quantity) }
      } else {
        menuCount[menu.id].quantity += Number(item.quantity)
      }
    })

    const menuArray = Object.values(menuCount)
    menuArray.sort((a, b) => b.quantity - a.quantity)
    const top5 = menuArray.slice(0, 5)

    return top5
  }
  private async getTopCategoryChart() {
    const now = DateTime.now()
    const chart = new ChartJSNodeCanvas({ width: 600, height: 240 })

    const startThisMonth = now.startOf('month').toSQL()
    const endThisMonth = now.endOf('month').toSQL()
    const orders = await OrderItem.query()
      .preload('menuItem', (q) => q.preload('category'))
      .whereBetween('createdAt', [startThisMonth, endThisMonth])

    const categoryCount: Record<number, { name: string; quantity: number }> = {}

    orders.forEach((item) => {
      const category = item.menuItem?.category
      if (!category) return

      if (!categoryCount[category.id]) {
        categoryCount[category.id] = { name: category.name, quantity: Number(item.quantity) }
      } else {
        categoryCount[category.id].quantity += Number(item.quantity)
      }
    })

    const categoryArray = Object.values(categoryCount).sort((a, b) => b.quantity - a.quantity)

    const totalQuantity = categoryArray.reduce((sum, c) => sum + c.quantity, 0)

    const top5 = categoryArray.slice(0, 5)

    const labels = top5.map((c) => {
      const percent = ((c.quantity / totalQuantity) * 100).toFixed(1)
      return `${c.name} (${percent}%)`
    })

    const values = top5.map((c) => c.quantity)
    const colors = ['#E74C3C', '#F39C12', '#A0522D', '#27AE60', '#F7DC6F']
    const buffer = await chart.renderToBuffer({
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              color: '#000',
              font: { size: 14, weight: 'bold' },
            },
          },
          title: {
            display: true,
            text: 'Top 5 Kategori Favorit',
            color: '#000',
            font: { size: 18, weight: 'bold' },
          },
        },
      },
    })

    return buffer.toString('base64')
  }

  async dashboard(ctx: HttpContext) {
    const summaryData = await this.getSummaryData()
    const revenueChart = await this.generateRevenueChart()
    const top5Menu = await this.getFavMenu()
    const topCategoriesChart = await this.getTopCategoryChart()
    return ctx.inertia.render('home', { summaryData, revenueChart, top5Menu, topCategoriesChart })
  }
}
