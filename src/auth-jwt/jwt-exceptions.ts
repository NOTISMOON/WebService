export class TokenExpiredException extends Error {
  constructor() {
    super('TOKEN_EXPIRED');
  }
}

export class UnauthorizedTokenException extends Error {
  constructor() {
    super('UNAUTHORIZED');
  }
}