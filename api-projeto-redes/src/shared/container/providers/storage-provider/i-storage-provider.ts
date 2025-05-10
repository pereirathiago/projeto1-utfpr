interface IStorageProvider {
  save(file: string, folder: string): Promise<string>
  readonly url: string
  delete(file: string, folder: string): Promise<void>
}

export { IStorageProvider }
