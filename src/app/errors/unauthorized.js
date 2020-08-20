export class UnauthorizedError extends Error {
  constructor() {
    super(`You cannot do this, your user is not authorized`);
    this.name = 'UnauthorizedError';
  }
}
