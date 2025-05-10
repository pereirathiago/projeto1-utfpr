export class ServerError extends Error {
  readonly error: Error
  constructor (error?: Error) {
    super(error?.message || 'Erro interno')
    this.error = {
      name: 'ServerError',
      message: error?.message || 'Erro interno',
      stack: error?.stack
    }
  }
}