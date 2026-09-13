import { betterAuth } from "better-auth";
import { betterAuthConfig } from "#backend/auth/auth.config.js";

export const auth = betterAuth(betterAuthConfig);

export default auth;
