import "dotenv/config";
import winston from "winston";

const logFormat = winston.format.simple();

if (process.env.NODE_ENV.trim() === "production") {
  var logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: "info",
        format: logFormat
      }),

      new winston.transports.File({
        filename: "./errors.log",
        level: "error",
        format: logFormat
      })
    ]
  });
} else {
  var logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: "info",
        format: logFormat
      }),
      new winston.transports.File({
        filename: "./warn.log",
        level: "warn", 
        format: logFormat
      }), 
      new winston.transports.File({
        filename: "./errors.log",
        level: "error",
        format: winston.format.simple()
      }),
      new winston.transports.File({
        filename: "./fatal.log",
        level: "fatal", 
        format: logFormat
      })
    ]
  });
}

export default logger;
