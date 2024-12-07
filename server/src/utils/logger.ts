import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file"; // Importing DailyRotateFile transport
const { combine, timestamp, json, printf, colorize } = format;

// Custom format for console logging with colors
const consoleLogFormat = combine(
    colorize(),
    printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    })
);

// Create a Winston logger
const logger = createLogger({
    level: "info",
    format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        json()
    ),
    transports: [
        new transports.Console({
            format: consoleLogFormat, // Custom format for console
        }),
        new DailyRotateFile({
            filename: "logs/application-%DATE%.log", // Log file name pattern
            datePattern: "YYYY-MM-DD", // Daily rotation
            maxSize: "20m", // Maximum size of each log file before rotation
            maxFiles: "1d", // Keep log files for the last 14 days
            zippedArchive: true, // Compress old log files
            format: combine(
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                json()
            ), // Format for file logs
        }),
    ],
});

export default logger;