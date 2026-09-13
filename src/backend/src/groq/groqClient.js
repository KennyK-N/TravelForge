import Groq from "groq-sdk";
import config from "#backend/config/index.js";

export const groqClient =
  globalThis.groqClient ||
  new Groq({
    apiKey: config.GROQ_API_KEY,
  });

if (config.NODE_ENV !== "production") globalThis.groqClient = groqClient;

export default groqClient;
