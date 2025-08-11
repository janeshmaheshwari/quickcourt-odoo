const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    const startTime = Date.now();
    
    try {
      // Add request start time to req object for response timing
      req.startTime = startTime;
      
      // Execute the request handler
      await Promise.resolve(requestHandler(req, res, next));
      
      // If response is sent, add response time
      if (res.headersSent) {
        const responseTime = Date.now() - startTime;
        console.log(`${req.method} ${req.originalUrl} - ${responseTime}ms`);
      }
    } catch (error) {
      // Add request context to error for better debugging
      if (error.addRequestInfo) {
        error.addRequestInfo(req.method, req.originalUrl, req.ip);
      }
      
      // Add user info if available
      if (req.user && error.addUserInfo) {
        error.addUserInfo(req.user._id, req.user.role);
      }
      
      // Log error with context
      console.error(`Error in ${req.method} ${req.originalUrl}:`, {
        message: error.message,
        stack: error.stack,
        user: req.user?._id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      
      // Pass error to next middleware
      next(error);
    }
  };
};

export { asyncHandler };
