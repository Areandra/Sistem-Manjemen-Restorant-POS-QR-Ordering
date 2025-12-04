import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login(ctx: HttpContext) {
    if (ctx.request.method() === 'GET') return ctx.inertia.render('auth/login')

    const body = ctx.request.only(['email', 'password'])
    const user = await User.verifyCredentials(body.email, body.password)

    await ctx.auth.use('web').login(user)

    return ctx.response.redirect('/table')
  }
}
