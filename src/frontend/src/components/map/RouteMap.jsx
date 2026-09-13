import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Polyline,
  useMap,
  Popup,
  Marker,
} from "react-leaflet";
import { useEffect, useMemo } from "react";
import polyline from "@mapbox/polyline";

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) map.setView(center);
  }, [center, map]);

  return null;
}

export default function RouteMap({
  osrmData,
  fallbackRoute = [],
  center = [0, 0],
  events = [],
  className = "",
}) {
  const route = useMemo(() => {
    if (osrmData?.routes?.[0]) {
      return polyline.decode(osrmData.routes[0].geometry);
    }

    return fallbackRoute;
  }, [osrmData, fallbackRoute]);

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} />

        {route.length > 0 && (
          <Polyline positions={route} color="blue" weight={5} />
        )}

        {fallbackRoute.map((point, index) => {
          const event = events[index];

          return (
            <Marker key={index} position={point}>
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">
                    {event?.title ?? `Waypoint ${index + 1}`}
                  </p>

                  {event?.time && (
                    <p className="text-sm">
                      <strong>Time:</strong> {event.time}
                    </p>
                  )}

                  {event?.places && (
                    <p className="text-sm">
                      <strong>Place:</strong> {event.places}
                    </p>
                  )}

                  {event?.desc && <p className="text-sm">{event.desc}</p>}

                  <p className="text-xs text-gray-500">
                    {point[0]}, {point[1]}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
