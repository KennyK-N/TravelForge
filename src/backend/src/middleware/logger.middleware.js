import chalk from "chalk";
import morgan from "morgan";

const customloggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"] || "N/A";
  const hostname = req.hostname;

  console.log(`${chalk.blue(hostname)}`);

  console.log(
    `${chalk.gray(timestamp)} - ${chalk.blue(ip)} - ${chalk.green(method)} ${url} - ${chalk.yellow(userAgent)}`,
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    let statusColor = chalk.green;

    if (statusCode >= 500) {
      // Server error
      statusColor = chalk.red;
    } else if (statusCode >= 400) {
      // Client error
      statusColor = chalk.yellow;
    } else if (statusCode >= 300) {
      // Redirection
      statusColor = chalk.cyan;
    }

    console.log(
      `${chalk.gray(timestamp)} - ${chalk.blue(ip)} - ${statusColor(method)} ${url} ${statusColor(statusCode)} - ${duration}ms`,
    );
  });

  res.on("close", () => {
    console.log("Client disconnected early");
  });

  next();
};

const morganMiddleware = morgan("combined");
const useCustomLog = true;

const loggerMiddleware = [
  useCustomLog ? customloggerMiddleware : morganMiddleware,
];

export default loggerMiddleware;
