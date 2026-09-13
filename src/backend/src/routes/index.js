import express from "express";

import config from "#backend/config/index.js";

import { authRouter } from "#backend/routes/auth-routes.js";
import groqRouter from "#backend/routes/groq-routes.js";
import osrmRouter from "#backend/routes/osrm-routes.js";
import taskRouter from "#backend/routes/task-routes.js";
import userSettingRouter from "#backend/routes/userSetting-routes.js";

const routerMiddleware = express.Router();

const defaultRoute = routerMiddleware.get("/", (req, res, next) => {
  try {
    res.redirect(config.FRONT_END_URL);
  } catch (error) {
    next(error);
  }
});

// This middleware handles all unmatched routes and should be registered after all defined routes
// and before the error-handling middleware to ensure it only runs when no other route matches.
function invalidRouteHandler(req, res) {
  res.redirect("/auth/me");
}

const Router = [
  defaultRoute,
  routerMiddleware.use("/auth", authRouter),
  routerMiddleware.use("/ai", groqRouter),
  osrmRouter,
  routerMiddleware.use("/task", taskRouter),
  routerMiddleware.use("/setting", userSettingRouter),
  invalidRouteHandler,
];

export default Router;
