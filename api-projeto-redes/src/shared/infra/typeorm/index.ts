import { AppDataSource } from "./data-source";

async function initializeDatabase() {
  try {
    await AppDataSource.initialize().then(() => console.log('Database connected successfully'))
  } catch (error) {
    console.error('Error connecting to the database:', error)
    process.exit(1)
  }
}

export default initializeDatabase