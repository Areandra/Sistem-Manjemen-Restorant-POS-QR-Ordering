import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
import fs from 'fs'

const dbConfig = defineConfig({
  connection: 'mysql',
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        // ssl: {
        //   ca: fs.readFileSync('./certs/ca.pem'),
        //   // ca: env.get('CA'),
        //   minVersion: 'TLSv1.2',
        //   rejectUnauthorized: true,
        // },
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
