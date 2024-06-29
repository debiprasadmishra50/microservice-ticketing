import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  status = 500;
  reason = "Error connecting to Database!";
  constructor() {
    super("Error connecting to Database!");

    // Only because we are extensing a build in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
