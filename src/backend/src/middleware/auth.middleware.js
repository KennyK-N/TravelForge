import { auth } from "#backend/auth/auth.client.js";
import { fromNodeHeaders } from "better-auth/node";
import {
  AUTH_COOKIE_NAME,
  UID_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "#backend/util/constants.js";

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.cookies[AUTH_COOKIE_NAME]) {
      throw new Error("Invalid Credentials/ User is not signed in");
    }

    const response = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!response) {
      throw new Error("Invalid Credentials/ User is not signed in");
    }

    if (!req.cookies[UID_COOKIE_NAME]) {
      const id = response.user.id;
      res.cookie(UID_COOKIE_NAME, id, SESSION_COOKIE_OPTIONS);
    }

    next();
  } catch (err) {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.clearCookie(UID_COOKIE_NAME);
    err.statusCode = 401;
    next(err);
  }
};

export default authMiddleware;
