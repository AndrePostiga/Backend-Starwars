export class NotFoundError extends Error {
  constructor(notFoundItemName) {
    super(`Cannot found ${notFoundItemName}`);
    this.name = 'NotFoundError';
  }
}
