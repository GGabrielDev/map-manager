import { config as loadEnv } from 'dotenv'
import sqlite3 from 'sqlite3'

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
loadEnv({ path: envFile })

export const BASE_URL = process.env.BASE_URL || 'localhost'

export const isTest = process.env.NODE_ENV === 'test'

export const dbConfig = {
  dialect: process.env.DB_DIALECT as 'sqlite' | 'postgres',
  storage: process.env.DB_STORAGE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}