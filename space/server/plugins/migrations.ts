import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { join } from 'pathe'

export default defineNitroPlugin(async () => {
  if (process.dev) {
    const { dir } = useRuntimeConfig().db
    migrate(useDb() as BetterSQLite3Database, { migrationsFolder: join(dir, './migrations') })
  }
})