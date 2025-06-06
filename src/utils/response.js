const logger = require("./logger");

const options = {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false // 24h format
};

const responseUtils = {
  // Success response
  success(res, data, message = "Success", statusCode = 200) {
    const responseObj = {
      status: "success",
      message,
      data,
      timestamp: new Date().toLocaleString("en-GB", options).replace(",", " -")
    };
    return res.status(statusCode).json(responseObj);
  },

  // Error response
  error({
    res,
    message = "Đã có lỗi xảy ra. Vui lòng thử lại.",
    errorCode = "INTERNAL_SERVER_ERROR",
    statusCode = 500,
    errorObject = null
  }) {
    const responseObj = {
      status: "error",
      message,
      errorCode,
      statusCode,
      timestamp: new Date().toLocaleString("en-GB", options).replace(",", " -")
    };
    if (errorObject instanceof Error) {
      logger.error(errorObject); // Sẽ có cả message và stack
    } else if (errorObject !== null) {
      logger.error(
        `${
          responseObj.timestamp
        } - ${errorCode} - ${message} - ${JSON.stringify(errorObject)}`
      );
    } else {
      logger.error(`${responseObj.timestamp} - ${errorCode} - ${message}`);
    }

    return res.status(statusCode).json(responseObj);
  },

  // Validation error response
  validationError(
    res,
    errors,
    message = "Validation failed",
    statusCode = 400
  ) {
    const responseObj = {
      status: "error",
      message,
      errorCode: "VALIDATION_ERROR",
      statusCode,
      errors,
      timestamp: new Date().toLocaleString("en-GB", options).replace(",", " -")
    };
    return res.status(statusCode).json(responseObj);
  },

  // Unauthorized response
  unauthorized(res, message = "Unauthorized access", statusCode = 401) {
    const responseObj = {
      status: "error",
      message,
      errorCode: "UNAUTHORIZED",
      statusCode,
      timestamp: new Date().toLocaleString("en-GB", options).replace(",", " -")
    };
    return res.status(statusCode).json(responseObj);
  },

  // Not found response
  notFound(res, message = "Resource not found", statusCode = 404) {
    const responseObj = {
      status: "error",
      message,
      errorCode: "NOT_FOUND",
      statusCode,
      timestamp: new Date().toLocaleString("en-GB", options).replace(",", " -")
    };
    return res.status(statusCode).json(responseObj);
  },

  // Conflict response
  conflict(res, message = "Conflict", statusCode = 409) {
    const responseObj = {
      status: "error",
      message,
      errorCode: "CONFLICT",
      statusCode,
      timestamp: new Date().toLocaleString("en-GB", options).replace(",", " -")
    };
    return res.status(statusCode).json(responseObj);
  }
};

module.exports = responseUtils;
