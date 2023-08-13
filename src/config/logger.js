import winston from "winston";

/*const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warn",
      format: winston.format.simple(),
    }),
  ],
});



/* req.logger.info(
    `${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`
  ); */


const devLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.colorize({ all: true }),
    }),
  ],
});

const prodLogger=winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "http",
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warn",
      format: winston.format.simple(),
    }),
  ],
});


export const addLogger = (req, res, next) => {
  
  const enviroment = process.env.NODE_ENV || 'development';

  if (envirtoment === 'production'){

  }else if (environment === 'development') {

  }

  next();
};