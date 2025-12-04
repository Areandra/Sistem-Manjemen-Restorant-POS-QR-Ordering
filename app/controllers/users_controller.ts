import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  async index({ inertia }: HttpContext) {
    const users = await User.query().orderBy('id', 'desc')
    return inertia.render('user/index', { data: users })
  }

  async store({ request, response, inertia }: HttpContext) {
    if (request.method() === 'GET') {
      return inertia.render('user/create', { roles: ['cashier', 'waiter', 'kitchen'] })
    }
    const data = request.only(['name', 'email', 'role', 'avatarUrl', 'status', 'password'])

    if (['cashier', 'waiter', 'kitchen'].includes(data.role))
      await User.create({
        ...data,
      })

    return response.redirect('/users')
  }

  async show({ params, inertia }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return inertia.render('users/show', { user })
  }

  async update({ request, params, response, inertia }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (request.method() === 'GET') {
      const initialData = {
        name: user.name,
        email: user.email,
        password: 'tipu',
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl,
      }
      return inertia.render('user/create', { roles: ['cashier', 'waiter', 'kitchen'], initialData })
    }

    const data = request.only(['name', 'email', 'role', 'avatarUrl', 'status'])

    user.merge(data)
    await user.save()

    return response.redirect('/users')
  }

  async updatePassword({ request, params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const { password } = request.only(['password'])
    const hashed = await hash.make(password)

    user.password = hashed
    await user.save()

    return response.redirect().toRoute('users.show', { id: user.id })
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.redirect('/users')
  }

  async togleStatus({ params, response, request }: HttpContext) {
    const user = await User.findOrFail(params.id)

    user.status = request.only(['status']).status

    await user.save()

    return response.redirect('/users')
  }
}
