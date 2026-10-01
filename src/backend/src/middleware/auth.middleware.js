import { auth } from "#backend/auth/auth.client.js";
import { fromNodeHeaders } from "better-auth/node";

const authMiddleware = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      throw new Error("Invalid Credentials/ User is not signed in");
    }

    req.session = session;
    req.userId = session.user.id;
    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

export default authMiddleware;
