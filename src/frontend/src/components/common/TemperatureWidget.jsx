import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { backEndUrl } from "@utils/constants";

export default function TemperatureWidget({
  city,
  country,
  startdate,
  enddate,
  temperature,
  taskId,
  precipitation,
  latitude,
  longitude,
  setTripInfo,
}) {
  const isEmpty = (value) =>
    value === null || value === undefined || value === "";

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.patch(`${backEndUrl}/task/updateWeather`, data, {
        withCredentials: true,
      });
      return res.data;
    },

    onSuccess: (res) => {
      const temp = res?.data?.temp;
      const precipitation = res?.data?.precipitation;

      setTripInfo((prev) => ({
        ...prev,
        temp: temp,
        precipitation: precipitation,
      }));
    },

    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    const missingTemperature = isEmpty(temperature);
    const missingPrecipitation = isEmpty(precipitation);

    if (!missingTemperature && !missingPrecipitation) return;
    if (isEmpty(latitude) || isEmpty(longitude) || isEmpty(taskId)) return;

    mutate({ taskId, latitude, longitude });
  }, [temperature, precipitation, latitude, longitude, taskId, mutate]);

  const hasWeatherData = !isEmpty(temperature) && !isEmpty(precipitation);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-md/4 dark:border-white/[0.08] dark:bg-white/[0.03]">
      {hasWeatherData ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Temperature · {city}, {country}
            </div>

            <div className="mt-2 text-5xl font-medium leading-none text-gray-900 dark:text-white/90">
              {temperature}°
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="text-xs font-medium text-gray-400 dark:text-gray-500">
              {startdate} – {enddate}
            </div>

            <div className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
              Precipitation · {precipitation}mm
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Weather · {city}, {country}
            </div>

            <div className="mt-2 text-lg font-medium text-gray-900 dark:text-white/90">
              Weather data unavailable
            </div>

            <div className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              We couldn’t retrieve temperature or precipitation for this trip.
            </div>
          </div>

          <div className="w-fit rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-gray-400">
            Not available
          </div>
        </div>
      )}
    </div>
  );
}
