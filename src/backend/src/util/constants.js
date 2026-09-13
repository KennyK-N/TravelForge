export const AUTH_COOKIE_NAME = "better-auth.session_token";
export const UID_COOKIE_NAME = "uid";

export const SESSION_COOKIE_OPTIONS = {
  maxAge: 604800000,
  path: "/",
  httpOnly: true,
  sameSite: "lax",
};

export const WEATHER_PAREM = {
  temp: "temperature_2m_mean",
  precipitation: "precipitation_sum",
};
