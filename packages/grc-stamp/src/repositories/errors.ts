export class BadFilterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadFilterError';
  }
}
