export class InvalidParameterError extends Error {
  constructor(paramName) {
    super(`Invalid parameter error: ${paramName}`);
    this.name = 'InvalidParameterError';
  }
}
