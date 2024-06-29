import { FieldValidationError, ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  status = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    // Only because we are extensing a build in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      err = err as FieldValidationError;
      return { message: err.msg, field: err.path };
    });
  }
}
