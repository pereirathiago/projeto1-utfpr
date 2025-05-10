import { container } from 'tsyringe'
import { LocalStorageProvider } from './implementations/local-storage-provider'
import { IStorageProvider } from './i-storage-provider'

const diskStorage = {
  local: LocalStorageProvider,
}

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  diskStorage[process.env.disk]
)
