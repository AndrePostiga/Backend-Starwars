export class ConflictError extends Error {
  constructor(message) {
    super(`Invalid request ${message}`);
    this.name = 'ConflictError';
  }
}
