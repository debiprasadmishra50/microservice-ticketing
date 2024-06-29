import { CustomError } from "./custom-error";

export class NotAuthorisedError extends CustomError {
  status = 401;
  constructor(public message: string) {
    super(message);

    // Only because we are extensing a build in class
    Object.setPrototypeOf(this, NotAuthorisedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
