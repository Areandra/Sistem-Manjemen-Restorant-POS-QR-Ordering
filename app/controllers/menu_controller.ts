import MenuCategory from '#models/menu_category'
import MenuItem from '#models/menu_item'
import type { HttpContext } from '@adonisjs/core/http'

export default class MenuController {
  async index(ctx: HttpContext) {
    const data = await MenuItem.query()
    const category = await MenuCategory.query()

    return ctx.inertia.render('menu/index', {
      data,
      category,
    })
  }

  async showByCategories(ctx: HttpContext) {
    const id = ctx.params.id

    const data = await MenuCategory.findOrFail(id)
    await data.load('items')
    const category = await MenuCategory.query()

    return ctx.inertia.render('menu/index', {
      data: data.items,
      category,
    })
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id

    const isNumber = !isNaN(Number(id))

    if (isNumber) {
      const data = await MenuItem.findOrFail(Number(id))

      return ctx.inertia.render('menu/show', {
        item: data,
      })
    }

    const data = await MenuCategory.findByOrFail('name', id)
    await data.load('items')
    const category = await MenuCategory.query()

    return ctx.inertia.render('menu/index', {
      data: data.items,
      category,
    })
  }

  async store(ctx: HttpContext) {
    if (ctx.request.method() === 'GET') {
      const categoryOptions = await MenuCategory.query()
      return ctx.inertia.render('menu/create', { categoryOptions })
    } else if (ctx.request.method() === 'POST') {
      const body = ctx.request.body()
      await MenuItem.create(body)

      return ctx.response.redirect('/menu')
    }
  }

  async storeCategories(ctx: HttpContext) {
    if (ctx.request.method() === 'GET') {
      return ctx.inertia.render('menu/category/create')
    } else if (ctx.request.method() === 'POST') {
      const body = ctx.request.body()
      await MenuCategory.create(body)

      return ctx.response.redirect('/menu')
    }
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await MenuItem.findOrFail(id)
    if (ctx.request.method() === 'GET') {
      const categoryOptions = await MenuCategory.query()
      return ctx.inertia.render('menu/create', {
        initialData: {
          name: data.name,
          categoryId: data.categoryId,
          description: data.description,
          price: data.price,
          costOfGoods: data.costOfGoods,
          imageUrl: data.imageUrl,
          isAvailable: data.isAvailable,
          sku: data.sku,
        },
        categoryOptions,
      })
    } else if (ctx.request.method() === 'POST') {
      const body = ctx.request.body()
      data.merge(body)
      data.save()

      return ctx.response.redirect('/menu')
    }
  }

  async updateCategories(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await MenuCategory.findOrFail(id)
    if (ctx.request.method() === 'GET') {
      return ctx.inertia.render('menu/category/create', {
        initialData: { name: data.name, description: data.description, sortOrder: data.sortOrder },
      })
    } else if (ctx.request.method() === 'POST') {
      const body = ctx.request.body()
      data.merge(body)
      data.save()

      return ctx.response.redirect('/menu')
    }
  }

  async delete(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await MenuItem.findOrFail(id)

    await data.delete()

    return ctx.response.redirect('/menu')
  }

  async deleteCategories(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await MenuCategory.findOrFail(id)

    await data.delete()

    return ctx.response.redirect('/menu')
  }

  async moveUp({ params, response }: HttpContext) {
    const category = await MenuCategory.findOrFail(params.id)

    const above = await MenuCategory.query()
      .where('sort_order', '<', category.sortOrder)
      .orderBy('sort_order', 'desc')
      .first()

    if (!above) return response.redirect('/menu')

    const temp = category.sortOrder
    category.sortOrder = above.sortOrder
    above.sortOrder = temp

    await category.save()
    await above.save()

    return response.redirect('/menu')
  }

  async moveDown({ params, response }: HttpContext) {
    const category = await MenuCategory.findOrFail(params.id)

    const below = await MenuCategory.query()
      .where('sort_order', '>', category.sortOrder)
      .orderBy('sort_order', 'asc')
      .first()

    if (!below) return response.redirect('/menu')

    const temp = category.sortOrder
    category.sortOrder = below.sortOrder
    below.sortOrder = temp

    await category.save()
    await below.save()

    return response.redirect('/menu')
  }
}
