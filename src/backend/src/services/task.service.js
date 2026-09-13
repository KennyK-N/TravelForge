import { Prisma } from "@prisma/client";
import { prisma } from "#backend/prisma/prisma.client.js";

class Task {
  constructor() {
    this.client = prisma;
  }

  async createTask({
    planName,
    startDate,
    endDate,
    data,
    userId,
    temp,
    precipitation,
    toCountry,
    toCity,
  }) {
    try {
      if (!userId) {
        throw new Error("User id is required");
      }

      const task = await this.client.task.create({
        data: {
          userId,
          planName,
          startDate,
          endDate,
          data,
          toCountry,
          toCity,
          weather: {
            create: {
              temp,
              precipitation,
            },
          },
        },
        include: {
          weather: true,
        },
      });

      return {
        success: true,
        msg: "Task created successfully",
        data: task.id,
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to create task",
        data: null,
      };
    }
  }

  async viewTask({ taskId, userId }) {
    try {
      if (!userId || !taskId) {
        throw new Error("User id/Task Id is required");
      }
      const task = await this.client.task.findFirst({
        where: {
          id: taskId,
          userId,
        },
        include: {
          weather: true,
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      return {
        success: true,
        msg: "Task fetched successfully",
        data: task,
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to fetch task",
        data: null,
      };
    }
  }
  // maybe add a limit who know
  async SearchTaskIds({ planName, userId }) {
    try {
      if (!userId) {
        throw new Error("User id is required");
      }

      const tasks = await this.client.task.findMany({
        where: {
          planName: {
            contains: planName,
            mode: "insensitive",
          },
          userId,
        },
        select: {
          id: true,
          planName: true,
          toCountry: true,
          toCity: true,
          startDate: true,
          endDate: true,
        },
      });

      return {
        success: true,
        msg: "Tasks fetched successfully",
        data: tasks,
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to fetch tasks",
        data: null,
      };
    }
  }

  async getTasks({ userId, page = 1, limit = 10 }) {
    try {
      if (!userId) {
        throw new Error("User id is required");
      }

      const skip = (page - 1) * limit;

      const taskIds = await this.client.task.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          planName: true,
          startDate: true,
          endDate: true,
          toCity: true,
          toCountry: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: {
          id: "asc",
        },
      });

      return {
        success: true,
        msg: "Task IDs fetched successfully",
        data: taskIds,
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to fetch task IDs",
        data: null,
      };
    }
  }

  async deleteTask({ taskId, userId }) {
    try {
      if (!userId || !taskId) {
        throw new Error("User id/Task Id is required");
      }

      await this.client.$transaction(
        async (tx) => {
          const task = await tx.task.findFirst({
            where: {
              id: taskId,
              userId,
            },
          });

          if (!task) {
            throw new Error("Task not found");
          }

          await tx.task.delete({
            where: {
              id: taskId,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );

      return {
        success: true,
        msg: "Task deleted successfully",
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to delete task",
        data: null,
      };
    }
  }

  async deleteAllTasks({ userId }) {
    try {
      if (!userId) {
        throw new Error("User id is required");
      }

      const result = await this.client.task.deleteMany({
        where: {
          userId,
        },
      });

      return {
        success: true,
        msg: "Tasks deleted successfully",
        data: {
          deletedCount: result.count,
        },
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to delete tasks",
        data: null,
      };
    }
  }

  async updateWeather({ taskId, userId, temp, precipitation }) {
    try {
      if (!taskId) {
        throw new Error("Task id is required");
      }

      if (!userId) {
        throw new Error("User id is required");
      }

      if (!temp || !precipitation) {
        throw new Error("Temp and precipitation are required");
      }

      const result = await this.client.$transaction(
        async (tx) => {
          const task = await tx.task.findFirst({
            where: {
              id: taskId,
              userId,
            },
            include: {
              weather: true,
            },
          });

          if (!task) {
            throw new Error("Task not found");
          }

          if (!task.weather) {
            throw new Error("Weather record not found");
          }

          const isTempEmpty =
            task.weather.temp === null || task.weather.temp.trim() === "";

          const isPrecipitationEmpty =
            task.weather.precipitation === null ||
            task.weather.precipitation.trim() === "";

          if (!isTempEmpty || !isPrecipitationEmpty) {
            throw new Error("Weather already exists for this task");
          }

          const weather = await tx.weather.update({
            where: {
              taskId,
            },
            data: {
              temp,
              precipitation,
            },
          });

          return {
            success: true,
            msg: "Weather updated successfully",
            data: weather,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );

      return result;
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to update weather",
        data: null,
      };
    }
  }
}

export default new Task();
