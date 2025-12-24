import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  async run () {
    const admin = await User.query()
      .where('email', 'admin@restaurant.com')
      .first()

    if (admin) {
      console.log('Admin already exists, skipping seed')
      return
    }

    await User.createMany([
      {
        name: 'Admin',
        email: 'admin@restaurant.com',
        role: 'admin',
        status: 'active',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      },
      {
        name: 'Cashier',
        email: 'cashier@restaurant.com',
        role: 'cashier',
        status: 'active',
        password: 'cashier123'
      },
      {
        name: 'Kitchen',
        email: 'kitchen@restaurant.com',
        role: 'kitchen',
        status: 'active',
        password: 'kitchen123'
      }
    ])
  }
}
