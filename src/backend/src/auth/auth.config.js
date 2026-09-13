import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "#backend/prisma/prisma.client.js";
import config from "#backend/config/index.js";
import { sendResetPasswordEmail } from "#backend/services/brevo.service.js";

export const betterAuthConfig = {
  database: prismaAdapter(prisma, {
    provider: "postgres",
  }),

  session: {
    disableSessionRefresh: true,
  },

  secret: config.AUTH_SECRET,
  baseURL: config.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendResetPasswordEmail({ user, url });
      } catch (err) {
        console.error("Failed to send reset password email:", err);
      }
    },
  },
  trustedOrigins: [config.FRONT_END_URL],
  socialProviders: {
    google: {
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    deleteUser: {
      enabled: true,
    },
  },
};
