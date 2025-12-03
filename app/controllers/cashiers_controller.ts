import MenuCategory from '#models/menu_category'
import MenuItem from '#models/menu_item'
import Order from '#models/order'
import { HttpContext } from '@adonisjs/core/http'
export default class CashiersController {
  async index(ctx: HttpContext) {
    const data = await MenuItem.query()
    const category = await MenuCategory.query()
    const orders = await Order.query().preload('table')
    // return {
    //   data,
    //   category,
    // }

    return ctx.inertia.render('cashier/index', {
      data,
      category,
      orders,
    })
  }

  async showByCategories(ctx: HttpContext) {
    const id = ctx.params.id
    const orders = await Order.query().preload('table')

    const data = await MenuCategory.findOrFail(id)
    await data.load('items')
    const category = await MenuCategory.query()

    return ctx.inertia.render('cashier/index', {
      data: data.items,
      category,
      orders,
    })
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id

    const isNumber = !isNaN(Number(id))

    if (isNumber) {
      const data = await MenuItem.findOrFail(Number(id))

      return ctx.inertia.render('cashier/index', {
        item: data,
      })
    }

    const data = await MenuCategory.findByOrFail('name', id)
    await data.load('items')
    const category = await MenuCategory.query()

    return ctx.inertia.render('cashier/index', {
      data: data.items,
      category,
    })
  }
}
