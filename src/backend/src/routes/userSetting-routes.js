import express from "express";

import validateInput from "#backend/middleware/inputValidator.middleware.js";
import authMiddleware from "#backend/middleware/auth.middleware.js";

import userSettingService from "#backend/services/userSetting.service.js";
import { userSettingSchema } from "#backend/schemas/index.js";

import { UID_COOKIE_NAME } from "#backend/util/constants.js";

const userSettingRouter = express.Router();
userSettingRouter.use(authMiddleware);

userSettingRouter.patch(
  "/updateEmailNotification",
  validateInput(userSettingSchema.pick({ emailNotification: true })),
  async (req, res, next) => {
    try {
      const userId = req.cookies[UID_COOKIE_NAME];
      const { emailNotification } = req.validated.body;

      const response = await userSettingService.updateEmailNotification({
        userId,
        emailNotification,
      });

      if (!response.success) throw new Error(response.msg);
      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

userSettingRouter.patch(
  "/updateConfirmDelete",
  validateInput(userSettingSchema.pick({ confirmDelete: true })),
  async (req, res, next) => {
    try {
      const userId = req.cookies[UID_COOKIE_NAME];
      const { confirmDelete } = req.validated.body;

      const response = await userSettingService.updateConfirmDelete({
        userId,
        confirmDelete,
      });

      if (!response.success) throw new Error(response.msg);
      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

userSettingRouter.patch(
  "/updateTheme",
  validateInput(userSettingSchema.pick({ theme: true })),
  async (req, res, next) => {
    try {
      const userId = req.cookies[UID_COOKIE_NAME];
      const { theme } = req.validated.body;

      const response = await userSettingService.updateTheme({
        userId,
        theme,
      });

      if (!response.success) throw new Error(response.msg);
      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

userSettingRouter.get("/getSetting", async (req, res, next) => {
  try {
    const userId = req.cookies[UID_COOKIE_NAME];

    const response = await userSettingService.getSetting({ userId });
    if (!response.success) throw new Error(response.msg);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default userSettingRouter;
