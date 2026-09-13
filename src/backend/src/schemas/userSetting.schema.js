import { z } from "zod";

const userSettingSchema = z.strictObject({
  emailNotification: z.boolean({
    message: "emailNotification must be a boolean",
  }),

  confirmDelete: z.boolean({
    message: "confirmDelete must be a boolean",
  }),

  theme: z
    .boolean({
      message: "theme must be a boolean",
    })
    .transform((value) => (value ? "dark" : "light")),
});

export default userSettingSchema;
