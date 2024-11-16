export class ApiError {
  public message: string;
  public status: number;

  constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }

  public toString() {
    return `(${this.status}): ${this.message}`;
  }
}

export class AuthError extends ApiError {
  public retry: boolean;
  constructor(message: string) {
    super(message, 401);
    this.retry = true;
  }
}
