import express from "express";
import { auth } from "#backend/auth/auth.client.js";
import { fromNodeHeaders } from "better-auth/node";

import validateInput from "#backend/middleware/inputValidator.middleware.js";
import authMiddleware from "#backend/middleware/auth.middleware.js";

import taskService from "#backend/services/task.service.js";
import { sendCreateTaskEmail } from "#backend/services/brevo.service.js";
import { taskSchema } from "#backend/schemas/index.js";

import { getWeatherMetrics } from "#backend/services/weather.service.js";
import { generateTripPlan } from "#backend/services/groq.service.js";

import { UID_COOKIE_NAME } from "#backend/util/constants.js";
import config from "#backend/config/index.js";

const taskRouter = express.Router();
taskRouter.use(authMiddleware);

taskRouter.post(
  "/createTask",
  validateInput(taskSchema.createTask),
  async (req, res, next) => {
    try {
      const {
        planName,
        startDate,
        endDate,
        toCountry,
        toCity,
        interests,
        emailNotification,
      } = req.validated.body;

      const userId = req.cookies[UID_COOKIE_NAME];

      let tripPlanResponse;

      for (let attempt = 0; attempt < 2; attempt++) {
        tripPlanResponse = await generateTripPlan({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          toCity,
          toCountry,
          interests,
        });

        if (tripPlanResponse.success) {
          break;
        }
      }

      const data = tripPlanResponse.data;

      if (!tripPlanResponse.success) throw new Error(tripPlanResponse.msg);

      const latitude = String(data.itinerary[0].coordinates[0].latitude);
      const longitude = String(data.itinerary[0].coordinates[0].longitude);

      const weatherMetrics = await getWeatherMetrics(latitude, longitude);

      const { temp, precipitation } = {
        temp: String(weatherMetrics.data.temp),
        precipitation: String(weatherMetrics.data.precipitation),
      };

      const response = await taskService.createTask({
        planName,
        startDate,
        endDate,
        data,
        userId,
        temp,
        precipitation,
        toCountry,
        toCity,
      });

      if (!response.success) throw new Error(response.msg);

      if (emailNotification) {
        const taskId = response.data;

        const url = `${config.FRONT_END_URL}/view-travel-plan/${taskId}`;

        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });

        const user = session.user;

        await sendCreateTaskEmail({
          user,
          planName,
          startDate,
          endDate,
          toCity,
          toCountry,
          url,
        });
      }

      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

taskRouter.get(
  "/viewTask",
  validateInput(taskSchema.viewTask, "query"),
  async (req, res, next) => {
    try {
      const { taskId } = req.validated.query;

      const userId = req.cookies[UID_COOKIE_NAME];

      const response = await taskService.viewTask({ taskId, userId });

      if (!response.success) throw new Error(response.msg);
      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

taskRouter.get(
  "/searchTaskIds",
  validateInput(taskSchema.searchTaskIds, "query"),
  async (req, res, next) => {
    try {
      const { planName } = req.validated.query;

      const userId = req.cookies[UID_COOKIE_NAME];

      const response = await taskService.SearchTaskIds({ planName, userId });

      if (!response.success) throw new Error(response.msg);

      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

taskRouter.get(
  "/getTasks",
  validateInput(taskSchema.getTasks, "query"),
  async (req, res, next) => {
    try {
      const { page, limit } = req.validated.query;

      const userId = req.cookies[UID_COOKIE_NAME];

      const response = await taskService.getTasks({
        userId,
        page: Number(page),
        limit: Number(limit),
      });

      if (!response.success) throw new Error(response.msg);

      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

taskRouter.patch(
  "/updateWeather",
  validateInput(taskSchema.updateWeather),
  async (req, res, next) => {
    try {
      const { taskId, latitude, longitude } = req.validated.body;

      const userId = req.cookies[UID_COOKIE_NAME];

      const weatherMetrics = await getWeatherMetrics(latitude, longitude);

      const { temp, precipitation } = {
        temp: String(weatherMetrics.data.temp),
        precipitation: String(weatherMetrics.data.precipitation),
      };

      const response = await taskService.updateWeather({
        taskId,
        userId,
        temp,
        precipitation,
      });

      if (!response.success) throw new Error(response.msg);

      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

taskRouter.delete(
  "/deleteTask",
  validateInput(taskSchema.deleteTask, "query"),
  async (req, res, next) => {
    try {
      const { taskId } = req.validated.query;
      const userId = req.cookies[UID_COOKIE_NAME];

      const response = await taskService.deleteTask({ taskId, userId });

      if (!response.success) throw new Error(response.msg);

      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

taskRouter.delete("/deleteAllTasks", async (req, res, next) => {
  try {
    const userId = req.cookies[UID_COOKIE_NAME];
    const response = await taskService.deleteAllTasks({ userId });

    if (!response.success) throw new Error(response.msg);

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default taskRouter;
