import Table from '#models/table'
import type { HttpContext } from '@adonisjs/core/http'

export default class TablesController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const data = await Table.query().paginate(page || 1)

    return ctx.inertia.render('table/index', {
      tables: data,
    })
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await Table.findOrFail(id)

    return ctx.inertia.render('table/show', {
      tables: data,
    })
  }

  async store(ctx: HttpContext) {
    if (ctx.request.method() === 'GET') {
      return ctx.inertia.render('table/create')
    } else if (ctx.request.method() === 'POST') {
      const body = ctx.request.body()
      await Table.create(body)

      return ctx.response.redirect('/table')
    }
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await Table.findOrFail(id)
    if (ctx.request.method() === 'GET') {
      return ctx.inertia.render('table/create', {
        initialData: {
          table_number: data.tableNumber,
          capacity: data.capacity,
        },
      })
    } else if (ctx.request.method() === 'POST') {
      const body = ctx.request.body()
      data.merge(body)
      data.save()

      return ctx.response.redirect('/table')
    }
  }

  async delete(ctx: HttpContext) {
    const id = ctx.params.id
    const table = await Table.findOrFail(id)

    table.delete()

    return ctx.response.redirect('/table')
  }
}
