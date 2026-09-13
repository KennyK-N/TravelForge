import { z } from "zod";

const SUB_TITLE_MAX_LENGTH = 45;
const PLACE_MAX_LENGTH = 80;
const SUMMARY_MAX_LENGTH = 45;
const DESCRIPTION_MAX_LENGTH = 60;

const timeRegex =
  /^([01][0-9]|2[0-3]):[0-5][0-9]-([01][0-9]|2[0-3]):[0-5][0-9]$/;

const coordinateSchema = z.strictObject({
  latitude: z.number().min(-90).max(90).describe("Latitude of the place."),

  longitude: z.number().min(-180).max(180).describe("Longitude of the place."),
});

const itineraryDaySchema = z.strictObject({
  title: z
    .string()
    .max(35)
    .describe("Short theme for the day. Maximum 35 characters."),

  subtitles: z
    .array(
      z
        .string()
        .max(SUB_TITLE_MAX_LENGTH)
        .describe(
          "Short label for the matching activity. Maximum 45 characters.",
        ),
    )
    .min(1)
    .max(3),

  date: z.iso.date(),

  places: z
    .array(
      z
        .string()
        .max(PLACE_MAX_LENGTH)
        .describe(
          "Specific attraction, restaurant, or area. Maximum 80 characters.",
        ),
    )
    .min(1)
    .max(3),

  summary: z
    .string()
    .max(SUMMARY_MAX_LENGTH)
    .describe("Brief overview of the day. Maximum 45 characters."),

  description: z
    .array(
      z
        .string()
        .max(DESCRIPTION_MAX_LENGTH)
        .describe(
          "Brief description of the matching activity. Maximum 60 characters.",
        ),
    )
    .min(1)
    .max(3),

  coordinates: z
    .array(coordinateSchema)
    .min(1)
    .max(3)
    .describe(
      "Coordinates for each matching place. Must line up by index with places, subtitles, description, and time.",
    ),

  time: z
    .array(
      z
        .string()
        .regex(timeRegex)
        .describe("Activity time block in HH:mm-HH:mm format."),
    )
    .min(1)
    .max(3),
});

export const tripPlanZodSchema = z.strictObject({
  itinerary: z.array(itineraryDaySchema),
});

const inputSchema = {
  type: "json_schema",

  json_schema: {
    name: "trip_plan_prompt",

    strict: true,

    schema: z.toJSONSchema(tripPlanZodSchema),
  },
};

export default inputSchema;
