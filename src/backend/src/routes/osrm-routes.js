import express from "express";

import authMiddleware from "#backend/middleware/auth.middleware.js";
import validateInput from "#backend/middleware/inputValidator.middleware.js";

import { getPreciseRoute } from "#backend/services/osrm.service.js";

import { osrmRouteSchema } from "#backend/schemas/index.js";

const osrmRouter = express.Router();

osrmRouter.post(
  "/preciseRoute",
  authMiddleware,
  validateInput(osrmRouteSchema),
  async (req, res, next) => {
    try {
      const { coordinate, transportation } = req.validated.body;

      const response = await getPreciseRoute(coordinate, transportation);

      if (!response.success) {
        throw new Error(response.msg);
      }

      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

export default osrmRouter;
