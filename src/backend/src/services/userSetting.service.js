import { prisma } from "#backend/prisma/prisma.client.js";

class UserSetting {
  constructor() {
    this.client = prisma;
  }

  async updateEmailNotification({ userId, emailNotification }) {
    try {
      const setting = await this.client.setting.upsert({
        where: {
          userId,
        },
        update: {
          emailNotification,
        },
        create: {
          userId,
          emailNotification,
          confirmDelete: false,
          theme: "light",
        },
      });

      return {
        success: true,
        msg: "Email notification setting updated successfully",
        data: setting,
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to update email notification setting",
        data: null,
      };
    }
  }

  async updateConfirmDelete({ userId, confirmDelete }) {
    try {
      const setting = await this.client.setting.upsert({
        where: {
          userId,
        },
        update: {
          confirmDelete,
        },
        create: {
          userId,
          confirmDelete,
          emailNotification: false,
          theme: "light",
        },
      });

      return {
        success: true,
        msg: "Confirm delete setting updated successfully",
        data: setting,
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to update confirm delete setting",
        data: null,
      };
    }
  }

  async updateTheme({ userId, theme }) {
    try {
      const setting = await this.client.setting.upsert({
        where: {
          userId,
        },
        update: {
          theme,
        },
        create: {
          userId,
          theme,
          emailNotification: false,
          confirmDelete: false,
        },
      });

      return {
        success: true,
        msg: "Dark mode setting updated successfully",
        data: setting,
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to update dark mode setting",
        data: null,
      };
    }
  }

  async getSetting({ userId }) {
    try {
      const setting = await this.client.setting.upsert({
        where: {
          userId,
        },
        update: {}, // keep existing values
        create: {
          userId,
          emailNotification: false,
          confirmDelete: false,
          theme: "light",
        },
        select: {
          confirmDelete: true,
          theme: true,
          emailNotification: true,
        },
      });

      const account = await this.client.account.findFirst({
        where: {
          userId,
        },
        select: {
          providerId: true,
        },
      });

      return {
        success: true,
        msg: "Settings fetched successfully",
        data: {
          ...setting,
          ...account,
        },
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || "Failed to fetch settings",
        data: null,
      };
    }
  }
}

export default new UserSetting();
