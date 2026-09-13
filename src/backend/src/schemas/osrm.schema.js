import { z } from "zod";

const coordinateSchema = z
  .array(
    z.tuple([
      z.number(), // longitude
      z.number(), // latitude
    ]),
  )
  .min(2, "At least two coordinates are required");

const osrmRouteSchema = z.object({
  coordinate: coordinateSchema,
  transportation: z.enum(["walking", "driving", "bicycle"]).default("walking"),
});

export default osrmRouteSchema;
