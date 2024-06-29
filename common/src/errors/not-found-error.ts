import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  status: number = 404;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): {  message: string; field?: string | undefined }[] {
    return [{  message: this.message }];
  }
}
