const winston = require("winston");

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "DD-MM-YYYY|HH:mm:ss"
    }),
    winston.format.errors({ stack: true }), // Bắt cả stack khi dùng Error object
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}${
        stack ? `\nStack trace: ${stack}` : ""
      }`;
    })
  ),
  transports: [
    // new winston.transports.Console(), // Ghi log ra console
    new winston.transports.File({ filename: "logs/app.log" })
  ]
});

module.exports = logger;
