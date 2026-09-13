import { z } from "zod";

const MAX_ITEM = 5;

const taskBaseSchema = z.object({
  planName: z
    .string()
    .trim()
    .min(1, "Plan name cannot be empty")
    .max(1000, "Plan name cannot exceed 1000 characters"),

  startDate: z
    .string()
    .trim()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format, use YYYY-MM-DD for arrival date",
    })
    .pipe(z.transform((val) => new Date(val))),

  endDate: z
    .string()
    .trim()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format, use YYYY-MM-DD for leave date",
    })
    .pipe(z.transform((val) => new Date(val))),

  toCity: z
    .string()
    .trim()
    .min(1, "City cannot be empty")
    .max(200, "City cannot exceed 200 characters"),

  toCountry: z
    .string()
    .trim()
    .min(1, "Country cannot be empty")
    .max(200, "Country cannot exceed 200 characters"),

  interests: z
    .array(z.string().trim())
    .transform((arr) => arr.filter((s) => s.length > 0))
    .superRefine((arr, ctx) => {
      if (arr.length > MAX_ITEM) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: MAX_ITEM,
          type: "array",
          inclusive: true,
          message: `Max ${MAX_ITEM} interests allowed`,
        });
      }
    })
    .optional(),

  taskId: z
    .string()
    .trim()
    .min(1, "Task id is required")
    .max(200, "Task id cannot exceed 200 characters"),

  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .default(1),

  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .default(10),

  latitude: z
    .number({
      required_error: "Latitude is required",
      invalid_type_error: "Latitude must be a number",
    })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  longitude: z
    .number({
      required_error: "Longitude is required",
      invalid_type_error: "Longitude must be a number",
    })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  emailNotification: z.boolean().default(true),
});

const taskSchema = {
  createTask: taskBaseSchema.pick({
    planName: true,
    startDate: true,
    endDate: true,
    toCountry: true,
    toCity: true,
    interests: true,
    emailNotification: true,
  }),

  viewTask: taskBaseSchema.pick({
    taskId: true,
  }),

  searchTaskIds: taskBaseSchema.pick({
    planName: true,
  }),

  getTasks: taskBaseSchema.pick({
    page: true,
    limit: true,
  }),

  updateWeather: taskBaseSchema.pick({
    taskId: true,
    latitude: true,
    longitude: true,
  }),

  deleteTask: taskBaseSchema.pick({
    taskId: true,
  }),
};

export default taskSchema;
