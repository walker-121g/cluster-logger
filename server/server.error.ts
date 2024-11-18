import { failure } from "./middlewares/response.server";

export class ServerError {
  public message: string;
  public status: number;

  constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }

  public toJSON() {
    return {
      error: this.message,
    };
  }

  public toResponse() {
    return failure(this.status, this.message);
  }

  public toString() {
    return this.message;
  }
}
