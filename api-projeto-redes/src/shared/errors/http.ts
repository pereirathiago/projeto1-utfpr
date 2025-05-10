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

export class UnauthorizedError extends Error {
  readonly error: Error
  constructor () {
    super('Unauthorized')
    this.error = {
      name: 'UnauthorizedError',
      message: 'Unauthorized'
    }
  }
}

export class ForbiddenError extends Error {
  readonly error: Error
  constructor () {
    super('Access denied')
    this.error = {
      name: 'ForbiddenError',
      message: 'Access denied'
    }
  }
}

export class NotFoundError extends Error {
  readonly error: Error
  constructor () {
    super('Not found')
    this.error = {
      name: 'NotFoundError',
      message: 'Not found'
    }
  }
}

export class SendMailError extends Error {
  readonly error: Error
  constructor () {
    super('Send mail failure')
    this.error = {
      name: 'SendMailError',
      message: 'Send mail failure'
    }
  }
}

export class ConflictError extends Error {
  readonly error: Error
  constructor (type: string) {
    super('Conflict failure')
    this.error = {
      name: 'ConflictError',
      message: `${type} em uso!`
    }
  }
}
