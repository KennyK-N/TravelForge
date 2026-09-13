import express from "express";
import { auth } from "#backend/auth/auth.client.js";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";

import authMiddleware from "#backend/middleware/auth.middleware.js";
import validateInput from "#backend/middleware/inputValidator.middleware.js";
import { authSchema } from "#backend/schemas/index.js";

import { UID_COOKIE_NAME } from "#backend/util/constants.js";
import config from "#backend/config/index.js";

const betterAuthRouter = express.Router();
const authRouter = express.Router();

// Note: Place /api/auth/error before the catch-all/general route/handler
// because /api/auth/*splat may match incoming requests first and prevent the
// specific error handler from being reached.
betterAuthRouter.all("/api/auth/error", (req, res) => {
  res.redirect(config.FRONT_END_URL);
});

betterAuthRouter.all("/api/auth/*splat", toNodeHandler(auth));

authRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    res.json({
      success: true,
      isAuthenticated: true,
      ...session,
      msg: "User is authenticated",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

authRouter.post(
  "/sign-up",
  validateInput(authSchema.signUp),
  async (req, res, next) => {
    try {
      const { email, newPassword } = req.validated.body;

      let { name } = req.body;
      name = name ? name : "placeholder";
      const image = "placeholder";

      const data = await auth.api.signUpEmail({
        headers: fromNodeHeaders(req.headers),
        returnHeaders: true,
        body: {
          name: name,
          email: email,
          password: newPassword,
          image: image,
          callbackURL: config.FRONT_END_URL,
        },
      });
      var cookie = data.headers.get("set-cookie");

      if (cookie) {
        res.clearCookie(UID_COOKIE_NAME);
        res.append("Set-Cookie", cookie);
      }

      res.json({
        success: true,
        msg: "User has successfully signed up",
        isAuthenticated: true,
      });
    } catch (err) {
      next(err);
    }
  },
);

authRouter.post(
  "/sign-in",
  validateInput(authSchema.signIn),
  async (req, res, next) => {
    try {
      const { email, password } = req.validated.body;

      const data = await auth.api.signInEmail({
        headers: fromNodeHeaders(req.headers),
        returnHeaders: true,
        body: {
          email: email,
          password: password,
        },
      });

      var cookie = data.headers.get("set-cookie");

      if (cookie) {
        res.clearCookie(UID_COOKIE_NAME);
        res.append("Set-Cookie", cookie);
      }

      res.json({
        success: true,
        msg: "User has successfully logged in",
        isAuthenticated: true,
      });
    } catch (err) {
      next(err);
    }
  },
);

authRouter.post("/sign-out", authMiddleware, async (req, res, next) => {
  try {
    await signOutAndClearCookies(req, res);

    return res.json({
      success: true,
      isAuthenticated: false,
      msg: "User has successfully logged out",
    });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/google-sign-in", async (req, res, next) => {
  try {
    const data = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: config.FRONT_END_URL,
      },
      returnHeaders: true,
      headers: fromNodeHeaders(req.headers),
    });

    const cookie = data.headers.get("set-cookie");

    if (cookie) {
      res.clearCookie(UID_COOKIE_NAME);
      res.append("Set-Cookie", cookie);
    }

    return res.redirect(data.response.url);
  } catch (err) {
    next(err);
  }
});

authRouter.delete("/delete-account", authMiddleware, async (req, res, next) => {
  try {
    const data = await auth.api.deleteUser({
      headers: fromNodeHeaders(req.headers),
      returnHeaders: true,
      body: {},
    });

    const cookie = data.headers.get("set-cookie");

    if (cookie) {
      res.clearCookie(UID_COOKIE_NAME);
      res.append("Set-Cookie", cookie);
    }

    return res.json({
      success: true,
      isAuthenticated: false,
      msg: "Account deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post(
  "/change-password",
  authMiddleware,
  validateInput(authSchema.changePassword),
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.validated.body;

      await auth.api.changePassword({
        headers: fromNodeHeaders(req.headers),
        body: {
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        },
      });

      await signOutAndClearCookies(req, res);

      return res.json({
        success: true,
        isAuthenticated: false,
        msg: "Password changed successfully",
      });
    } catch (err) {
      next(err);
    }
  },
);

//HAVENT TESTED BELOW
authRouter.post(
  "/forgot-password",
  validateInput(authSchema.forgotPassword),
  async (req, res, next) => {
    try {
      const { email } = req.body;

      await auth.api.requestPasswordReset({
        headers: fromNodeHeaders(req.headers),
        body: {
          email,
          redirectTo: `${config.FRONT_END_URL}/reset-password`,
        },
      });

      return res.json({
        success: true,
        msg: "If an account exists for that email, a password reset link has been sent.",
      });
    } catch (err) {
      next(err);
    }
  },
);

authRouter.post(
  "/reset-password",
  validateInput(authSchema.resetPassword),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;

      await auth.api.resetPassword({
        headers: fromNodeHeaders(req.headers),
        body: {
          token,
          newPassword,
        },
      });

      return res.json({
        success: true,
        msg: "Password reset successfully",
      });
    } catch (err) {
      next(err);
    }
  },
);

export { authRouter, betterAuthRouter };

async function signOutAndClearCookies(req, res) {
  const data = await auth.api.signOut({
    returnHeaders: true,
    headers: fromNodeHeaders(req.headers),
  });

  const cookie = data.headers.get("set-cookie");

  if (cookie) {
    res.clearCookie(UID_COOKIE_NAME);
    res.append("Set-Cookie", cookie);
  }
}
