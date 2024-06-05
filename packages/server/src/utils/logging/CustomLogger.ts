import * as winston from "winston";
import "winston-daily-rotate-file";

// Basado en: https://manishbit97.medium.com/implementing-a-custom-logger-in-nestjs-a-step-by-step-guide-2f0a2d75d2e7

type FormatJSON = {
  timestamp: string;
  level: string;
  context?: string;
  message: string;
  error?: any;
};

export class CustomLogger {
  dailyRotateFileTransport!: any;

  myFormat!: winston.Logform.Format;

  createLoggerConfig!: winston.LoggerOptions;

  constructor() {
    /** A transport for winston which logs to a rotating file based on date* */
    this.dailyRotateFileTransport = new winston.transports.DailyRotateFile( {
      filename: "logs/log-%DATE%.log",
      zippedArchive: false,
      maxSize: "20m",
      maxFiles: "10d",
    } );

    /**
     * Custom log format tailored to our application's requirements
     */
    this.myFormat = winston.format.printf(
      ( { level = "info", message, timestamp, req, err, ...metadata } ) => {
        if (!req) {
          req = {
            headers: {},
          };
        }

        let msg = `${timestamp} [${level}] : ${message} `;
        const json: FormatJSON = {
          timestamp,
          level,
          ...metadata,
          message,
          error: {},
        };

        if (err)
          json.error = err.stack || err;

        msg = JSON.stringify(json);

        return msg;
      },
    );

    this.createLoggerConfig = {
      level: "info", // this will print warn and above level (error also)
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.errors( {
          stack: true,
        } ),
        winston.format.json(),
        winston.format.timestamp( {
          format: "YYYY-MM-DD HH:mm:ss",
        } ),
        this.myFormat,
      ),

      transports: [
        new winston.transports.Console( {
          level: "info",
          log: ((obj: FormatJSON, next) => {
            console.log(obj.timestamp.split(" ").at(-1), obj.level, "\x1b[33m", "[" + obj.context + "]", "\x1b[0m", obj.message);

            if (obj.error)
              console.error(obj.error);

            next();
          } ),
        } ),
        this.dailyRotateFileTransport,
      ],
    };
  }
}
