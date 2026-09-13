import axios from "axios";

import RouteMap from "@components/map/RouteMap";
import { useQuery } from "@tanstack/react-query";

import Spinner from "@components/common/Spinner";

const MAX_SNAP_DISTANCE = 200;
const OSRM_ENDPOINT = import.meta.env.VITE_OSRM_URL;

async function getOSRMRoute(route, signal) {
  const res = await axios.post(
    OSRM_ENDPOINT,
    {
      coordinate: route.map(([lat, lng]) => [lng, lat]),
    },
    {
      withCredentials: true,
      signal,
      timeout: 60000,
    },
  );

  return res.data.data;
}

export default function MapWidget({
  taskId,
  fallbackRoute,
  center,
  events = [],
}) {
  function isBadOSRMRoute(data) {
    if (!data) return true;
    if (data.code !== "Ok") return true;
    if (!data.routes?.length) return true;

    const route = data.routes[0];

    if (route.distance === 0 && route.duration === 0) return true;

    const badSnap = data.waypoints?.some(
      (waypoint) => waypoint.distance > MAX_SNAP_DISTANCE,
    );

    return badSnap;
  }

  const routeQuery = useQuery({
    queryKey: ["osrmRoute", taskId, fallbackRoute],
    enabled:
      Boolean(taskId) &&
      Array.isArray(fallbackRoute) &&
      fallbackRoute.length >= 2,

    queryFn: async ({ signal }) => {
      const data = await getOSRMRoute(fallbackRoute, signal);

      if (isBadOSRMRoute(data)) {
        return null;
      }

      return data;
    },

    retry: false,
    refetchOnWindowFocus: false,
  });

  if (routeQuery.isFetching) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  const osrmData = routeQuery.data ?? null;

  return (
    <RouteMap
      osrmData={osrmData}
      fallbackRoute={fallbackRoute}
      center={center}
      events={events}
      className="z-10 h-full w-full"
    />
  );
}
