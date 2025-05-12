class ApiError extends Error {
  constructor(status, message = "Internal Error", error = [], stack = "") {
    super(message);

    this.status = status;
    this.success = false;
    this.message = message;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      status: this.status,
      success: this.success,
      message: this.message,
      error: this.error,
    };
  }
}

export { ApiError };