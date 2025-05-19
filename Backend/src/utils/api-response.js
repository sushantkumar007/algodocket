class ApiResponse {
  constructor(status, success = true, message = "Success", data = {}) {
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
  }

  toJSON() {
    return {
      status: this.status,
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}

export { ApiResponse };