import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: Number(process.env.PORT),
  FRONT_END_URL: process.env.FRONT_END_URL,
  NODE_ENV: process.env.NODE_ENV,
  AUTH_SECRET: process.env.AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  APP_NAME: process.env.APP_NAME,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
};

export default config;
