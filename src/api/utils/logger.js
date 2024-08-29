
const winston= require("winston")
const DailyRotateFile =require("winston-daily-rotate-file");

//Destructure required components from winston module
const { createLogger, format, transports } = winston;
const { combine, timestamp, colorize, printf } = format;
//configure winston logger
const logger = createLogger({
  level: "info", //set the default log level
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(),
    printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: "logs/exception.log" })],
  rejectionHandlers: [new transports.File({ filename: "logs/rejection.log" })],
});
module.exports = logger;