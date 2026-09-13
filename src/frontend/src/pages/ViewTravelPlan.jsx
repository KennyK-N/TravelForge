import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronDown } from "lucide-react";

import SchedulePlan from "@components/schedule/SchedulePlanWidget";
import ScheduleDetail from "@components/schedule/ScheduleDetailWidget";
import TemperatureWidget from "@components/common/TemperatureWidget";
import ChatWidget from "@components/chat/ChatWidget";
import MapWidget from "@components/map/MapWidget";
import Spinner from "@components/common/Spinner";

import { formatISODate } from "@utils/dateUtils";
import { backEndUrl } from "@utils/constants";
import { ChevronLeftIcon } from "@icons";

export default function ViewTravelPlan() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expand, setExpand] = useState(false);
  const [itinerary, setItinerary] = useState([]);
  const [tripInfo, setTripInfo] = useState({});

  const { data, isPending, isError } = useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const res = await axios.get(`${backEndUrl}/task/viewTask/`, {
        params: { taskId: id },
        withCredentials: true,
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (!data) return;

    const response = data.data;
    const task = response.data;
    const tempItinerary = task.itinerary ?? [];
    const formattedItinerary = tempItinerary.map((item, index) => ({
      ...item,
      idx: index,
      ...(index === 0 ? { active: true } : { active: false }),
    }));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItinerary(formattedItinerary);

    const info = {
      startDate: formatISODate(response?.startDate),
      endDate: formatISODate(response?.endDate),
      toCity: response?.toCity,
      toCountry: response?.toCountry,
      temp: response?.weather?.temp,
      precipitation: response?.weather?.precipitation,
    };

    setTripInfo(info);
  }, [data]);

  const plans = useMemo(
    () =>
      itinerary.map((item) => ({
        date: item.date,
        title: item.title,
        summary: item.summary,
        active: item.active,
      })),
    [itinerary],
  );

  const events = useMemo(() => {
    const activeItem = itinerary.find((item) => item.active);

    if (!activeItem) return [];

    const fields = [
      activeItem.coordinates,
      activeItem.description,
      activeItem.places,
      activeItem.subtitles,
      activeItem.time,
    ];

    const minSize = Math.min(...fields.map((field) => field?.length ?? 0));

    return Array.from({ length: minSize }, (_, i) => ({
      time: activeItem.time[i],
      title: activeItem.subtitles[i],
      desc: activeItem.description[i],
      coordinates: activeItem.coordinates[i],
      places: activeItem.places[i],
    }));
  }, [itinerary]);

  const fallBackRoute = useMemo(() => {
    return events
      ? [
          ...events.map((event) => [
            event.coordinates.latitude,
            event.coordinates.longitude,
          ]),
        ]
      : [0, 0];
  }, [events]);

  const center = fallBackRoute[0] ?? [0, 0];

  if (isPending) return <Spinner />;
  if (isError) navigate("/error"); //navigate to error page

  function setActive(index) {
    setItinerary((prev) =>
      prev.map((item) => ({
        ...item,
        active: item.idx === index,
      })),
    );
  }

  return (
    <>
      {/* Main content */}
      <div className="h-[90%] flex flex-col gap-3 min-h-0 md:ml-5 sm:pr-3 md:pr-0 text-gray-900 dark:text-white/90">
        {/* Back button */}
        <Link
          to="/home"
          className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium
          text-gray-500 transition-colors
          hover:bg-gray-100 hover:text-gray-800
          dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
        >
          <ChevronLeftIcon className="size-4" />
          Back to home
        </Link>

        {/* Temperature */}
        <TemperatureWidget
          city={tripInfo.toCity}
          country={tripInfo.toCountry}
          startdate={tripInfo.startDate}
          enddate={tripInfo.endDate}
          temperature={tripInfo.temp}
          taskId={id}
          precipitation={tripInfo.precipitation}
          setTripInfo={setTripInfo}
          longitude={events[0]?.coordinates?.longitude ?? null}
          latitude={events[0]?.coordinates?.latitude ?? null}
        />

        {/* Itinerary */}
        <div className="flex flex-col md:flex-row gap-3 flex-1 min-h-0">
          {/* Today's Plan + Schedule Details */}
          <div className="flex flex-col gap-3 w-full md:w-[38%] md:shrink-0 md:min-h-0">
            <SchedulePlan items={plans} onClick={setActive} />
            <ScheduleDetail events={events} />
          </div>

          {/* Map */}
          <div className="flex-1 min-h-[400px] md:min-h-0 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xl/9 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <div className="relative z-0 h-full w-full">
              <MapWidget
                taskId={id}
                fallbackRoute={fallBackRoute}
                center={center}
                events={events}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <div
        className={`fixed bottom-0 right-[5%] w-[20rem] xl:w-[20vw] overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-xl transition-all duration-500 dark:border-white/[0.08] dark:bg-gray-900
        ${expand ? "h-[50vh]" : "h-[3rem]"}`}
        onClick={() => {
          if (!expand) setExpand(true);
        }}
      >
        {/* Header */}
        <div
          className="flex h-12 shrink-0 cursor-pointer select-none items-center justify-between border-b border-gray-100 bg-white px-4 dark:border-white/[0.08] dark:bg-gray-900"
          onClick={(e) => {
            e.stopPropagation();
            setExpand(!expand);
          }}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-white/90">
              AI Assistant
            </span>
          </div>

          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-300 dark:text-gray-500 ${
              expand ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Chat body */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            expand ? "h-[calc(100%-3rem)]" : "h-0"
          }`}
        >
          <ChatWidget />
        </div>
      </div>
    </>
  );
}
