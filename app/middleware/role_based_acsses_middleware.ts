import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleBasedAcssesMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles?: string[]) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.redirect('/login')
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return ctx.response.redirect('/forbidden')
    }

    return next()
  }
}
