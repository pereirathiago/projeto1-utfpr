import fs from 'fs'
import { resolve } from 'path'
import upload from 'config/upload'
import { IStorageProvider } from '../i-storage-provider'

class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    await fs.promises.rename(resolve(upload.tmpFolder, file),
      resolve(`${upload.tmpFolder}/${folder}`, file)
    )

    return file
  }

  get url(): string {
    return process.env.APP_API_URL
  }

  async delete(file: string, folder: string): Promise<void> {
    const filename = resolve(`${upload.tmpFolder}/${folder}`, file)

    try {
      await fs.promises.stat(filename)
    } catch {
      return
    }
    await fs.promises.unlink(filename)
  }
}

export { LocalStorageProvider }
