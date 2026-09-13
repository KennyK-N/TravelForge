import express from "express";
import cookieParser from "cookie-parser";

import config from "#backend/config/index.js";
import securityMiddleware from "#backend/middleware/security.middleware.js";
import loggerMiddleware from "#backend/middleware/logger.middleware.js";
import errorHandlerMiddleware from "#backend/middleware/errorHandler.middleware.js";

import Router from "#backend/routes/index.js";
import { betterAuthRouter } from "#backend/routes/auth-routes.js";

const app = express();

const PORT = config["PORT"] || 8080;

// app.use(loggerMiddleware);
app.use(securityMiddleware);
app.use(cookieParser());

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Mount all routes in here
app.use(betterAuthRouter);

app.use("/api", Router);
app.use(Router);

// Error handler middleware has to be mounted last
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with ${config.NODE_ENV} mode`);
});
