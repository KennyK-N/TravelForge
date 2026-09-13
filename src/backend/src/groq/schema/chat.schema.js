import { z } from "zod";

export const chatZodSchema = z.strictObject({
  text: z.string(),
});

export const chatSchema = {
  type: "json_schema",

  json_schema: {
    name: "trip_plan_chat",

    strict: true,

    schema: z.toJSONSchema(chatZodSchema),
  },
};

export default chatSchema;
