import { log } from "console";
import "dotenv/config";
import winston from "winston";

const customLevelsOptions = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: "grey",
    http: "green",
    info: "blue",
    warn: "yellow",
    error: "orange",
    fatal: "red",
  }
}

const logFormat = winston.format.simple();


if (process.env.NODE_ENV.trim() === "production") {
  var logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: logFormat
      }),

      new winston.transports.Console({
        level: "http",
        format: logFormat
      }),

      new winston.transports.Console({
        level: "info",
        format: logFormat
      }),

      new winston.transports.File({
        filename: "./errors.log",
        level: "warn",
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
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: logFormat
      }),
      new winston.transports.File({
        filename: "./errors.log",
        level: "warn", 
        format: logFormat
      }), 
      new winston.transports.File({
        filename: "./errors.log",
        level: "error",
        format: winston.format.simple()
      }),
      new winston.transports.File({
        filename: "./errors.log",
        level: "fatal", 
        format: logFormat
      })
    ]
  })
}

export default logger;