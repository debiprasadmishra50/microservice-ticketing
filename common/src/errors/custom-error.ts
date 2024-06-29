type ErrorType = {
  message: string;
  field?: string;
};

export abstract class CustomError extends Error {
  abstract status: number;
  abstract serializeErrors(): ErrorType[];

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
