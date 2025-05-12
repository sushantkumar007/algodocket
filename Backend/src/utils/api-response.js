class ApiResponse {
  constructor(status, success = true, message = "Success", data = {}) {
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
