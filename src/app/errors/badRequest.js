export class BadRequestError extends Error {
  constructor(paramText) {
    super(`Invalid request ${paramText}`);
    this.name = 'BadRequestError';
  }
}
