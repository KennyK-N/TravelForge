import express from "express";

import authMiddleware from "#backend/middleware/auth.middleware.js";
import inputValidator from "#backend/middleware/inputValidator.middleware.js";

import { generateAiMessage } from "#backend/services/groq.service.js";

import { messageHistorySchema } from "#backend/schemas/index.js";

const groqRouter = express.Router();

groqRouter.post(
  "/chat",
  inputValidator(messageHistorySchema),
  authMiddleware,
  async (req, res, next) => {
    const obj = req.validated.body;

    try {
      const response = await generateAiMessage(obj);

      if (!response.success) throw new Error(response.msg);

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

export default groqRouter;
