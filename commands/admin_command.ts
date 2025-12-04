import { BaseCommand, args } from '@adonisjs/core/ace'
import User from '#models/user'
import env from '#start/env'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class AdminCommand extends BaseCommand {
  static commandName = 'app:admin'
  static description =
    'Admin Management: create, password-reset, or destroy (only one admin allowed, requires super code)'

  @args.string({
    argumentName: 'action',
    description: 'Action: create, password-reset, or destroy.',
  })
  declare action: string

  @args.string({
    description: 'Email (required for password-reset or destroy)',
    required: false,
  })
  declare email?: string

  static options: CommandOptions = {
    startApp: true,
  }

  private async verifySuperCode(): Promise<boolean> {
    const adminCode = env.get('SUPER_PASSWORD')
    if (!adminCode) {
      this.logger.error('SUPER_PASSWORD is not set in .env')
      return false
    }

    const inputCode = await this.prompt.secure('Enter super admin code: ')
    if (inputCode !== adminCode) {
      this.logger.error('Invalid super admin code.')
      return false
    }

    return true
  }

  async run() {
    switch (this.action) {
      case 'create':
        if (!(await this.verifySuperCode())) return
        await this.createAdmin()
        break

      case 'password-reset':
        if (!this.email) {
          this.logger.error('Email is required for password-reset action.')
          return
        }
        if (!(await this.verifySuperCode())) return
        await this.resetPassword(this.email)
        break

      case 'destroy':
        if (!this.email) {
          this.logger.error('Email is required for destroy action.')
          return
        }
        if (!(await this.verifySuperCode())) return
        await this.destroyAdmin(this.email)
        break

      default:
        this.logger.error('Unknown action. Use: create, password-reset, destroy.')
    }
  }

  private async createAdmin() {
    const existingAdmin = await User.query().where('role', 'admin').first()
    if (existingAdmin) {
      this.logger.error(`Admin already exists: ${existingAdmin.email}`)
      return
    }

    const name = await this.prompt.ask('Name', {
      validate(value) {
        return value.length >= 3 ? true : 'Name must be at least 3 characters.'
      },
    })

    const email = await this.prompt.ask('Email', {
      validate(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Email format is invalid.'
      },
    })

    const password = await this.prompt.secure('Password', {
      validate(value) {
        return value.length >= 6 ? true : 'Password must contain at least 6 characters.'
      },
    })

    const confirmed = await this.prompt.confirm(`Confirm creating admin with email: ${email}?`)
    if (!confirmed) {
      this.logger.info('Cancelled.')
      return
    }

    try {
      const admin = await User.create({
        name,
        email,
        password,
        role: 'admin',
        status: 'active',
      })
      this.logger.success(`Admin created successfully: ${admin.email}`)
    } catch (error: any) {
      this.logger.error('Failed to create admin.')
      this.logger.error(error.message)
    }
  }

  private async resetPassword(email: string) {
    const admin = await User.findBy('email', email)
    if (!admin || admin.role !== 'admin') {
      this.logger.error(`No admin found with email: ${email}`)
      return
    }

    const newPassword = await this.prompt.secure('New Password: ', {
      validate(v) {
        return v.length >= 6 ? true : 'Password must contain at least 6 characters.'
      },
    })

    admin.password = newPassword
    await admin.save()
    this.logger.success(`Password for admin ${admin.email} successfully reset.`)
  }

  private async destroyAdmin(email: string) {
    const admin = await User.findBy('email', email)
    if (!admin || admin.role !== 'admin') {
      this.logger.error(`No admin found with email: ${email}`)
      return
    }

    await admin.delete()
    this.logger.success(`Admin ${email} successfully deleted.`)
  }
}
