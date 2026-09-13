import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import config from "#backend/config/index.js";

const securityMiddleware = [
  cors({
    origin: [config.FRONT_END_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specify allowed HTTP methods
    credentials: true,
  }),

  helmet(),

  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again later",
  }),
];

export default securityMiddleware;
