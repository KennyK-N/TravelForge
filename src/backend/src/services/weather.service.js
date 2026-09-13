import axios from "axios";
import { WEATHER_PAREM } from "#backend/util/constants.js";

const URL = "https://api.open-meteo.com/v1/forecast?";
const PARAMS = `daily=${WEATHER_PAREM.temp},${WEATHER_PAREM.precipitation}`;
const FORECAST = 1;

export async function getWeatherMetrics(latitude, longitude) {
  try {
    const res = await axios.get(
      `${URL}latitude=${latitude}&longitude=${longitude}&${PARAMS}&forecast_days=${FORECAST}`,
    );

    return {
      success: true,
      msg: "Weather received successfully",
      data: {
        temp: res.data.daily[WEATHER_PAREM.temp][0],
        precipitation: res.data.daily[WEATHER_PAREM.precipitation][0],
      },
    };
  } catch {
    return {
      success: false,
      msg: "Failed to fetch weather data",
      data: {
        temp: "",
        precipitation: "",
      },
    };
  }
}
