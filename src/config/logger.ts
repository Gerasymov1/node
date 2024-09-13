import winston from "winston";

const { combine, timestamp, printf, colorize, align } = winston.format;

const myFormat = printf(({ level, message, timestamp, childData }) => {
  console.log(level, message, timestamp, childData);
  return `${timestamp} ${level}: ${childData} ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A", // 2022-01-25 03:23:10.350 PM
    }),
    align(),
    myFormat
  ),
  transports: [
    new winston.transports.Console({ level: "error" }),
    new winston.transports.Console({ level: "info" }),
  ],
});

export default logger;
