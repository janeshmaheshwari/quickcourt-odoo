class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
    errorCode = null,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Static methods for common error types
  static badRequest(message = "Bad Request", errors = [], errorCode = "BAD_REQUEST") {
    return new ApiError(400, message, errors, "", errorCode, true);
  }

  static unauthorized(message = "Unauthorized", errors = [], errorCode = "UNAUTHORIZED") {
    return new ApiError(401, message, errors, "", errorCode, true);
  }

  static forbidden(message = "Forbidden", errors = [], errorCode = "FORBIDDEN") {
    return new ApiError(403, message, errors, "", errorCode, true);
  }

  static notFound(message = "Resource not found", errors = [], errorCode = "NOT_FOUND") {
    return new ApiError(404, message, errors, "", errorCode, true);
  }

  static conflict(message = "Resource conflict", errors = [], errorCode = "CONFLICT") {
    return new ApiError(409, message, errors, "", errorCode, true);
  }

  static validationError(message = "Validation failed", errors = [], errorCode = "VALIDATION_ERROR") {
    return new ApiError(422, message, errors, "", errorCode, true);
  }

  static tooManyRequests(message = "Too many requests", errors = [], errorCode = "RATE_LIMIT_EXCEEDED") {
    return new ApiError(429, message, errors, "", errorCode, true);
  }

  static internal(message = "Internal Server Error", errors = [], errorCode = "INTERNAL_ERROR") {
    return new ApiError(500, message, errors, "", errorCode, false);
  }

  static serviceUnavailable(message = "Service Unavailable", errors = [], errorCode = "SERVICE_UNAVAILABLE") {
    return new ApiError(503, message, errors, "", errorCode, false);
  }

  // Method to add additional context
  addContext(context) {
    this.context = context;
    return this;
  }

  // Method to add user information for debugging
  addUserInfo(userId, userRole) {
    this.userInfo = { userId, userRole };
    return this;
  }

  // Method to add request information
  addRequestInfo(method, url, ip) {
    this.requestInfo = { method, url, ip };
    return this;
  }
}

export { ApiError };
