class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.timestamp = new Date().toISOString();
  }

  // Static methods for common response types
  static success(data, message = "Success", statusCode = 200) {
    return new ApiResponse(statusCode, data, message);
  }

  static created(data, message = "Resource created successfully") {
    return new ApiResponse(201, data, message);
  }

  static noContent(message = "No content") {
    return new ApiResponse(204, null, message);
  }

  static partialContent(data, message = "Partial content") {
    return new ApiResponse(206, data, message);
  }

  // Method to add metadata
  addMetadata(metadata) {
    this.metadata = metadata;
    return this;
  }

  // Method to add pagination info
  addPagination(page, limit, total, totalPages) {
    this.pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
    return this;
  }

  // Method to add response time
  addResponseTime(startTime) {
    this.responseTime = Date.now() - startTime;
    return this;
  }

  // Method to add cache info
  addCacheInfo(cached, ttl) {
    this.cache = { cached, ttl };
    return this;
  }
}

export { ApiResponse };