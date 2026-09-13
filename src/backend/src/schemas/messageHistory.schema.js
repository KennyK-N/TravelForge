import z from "zod";

const prevMessageSchema = z.object({
  sender: z.enum(["AI", "User"]),
  message: z
    .string()
    .trim()
    .min(1, "Previous message cannot be empty")
    .max(1000, "Previous message cannot exceed 1000 characters"),
});

const messageHistorySchema = z.object({
  userMessage: z
    .string()
    .trim()
    .min(1, "User message cannot be empty")
    .max(1000, "User message cannot exceed 1000 characters"),

  previousMessages: z.array(prevMessageSchema),
});

export default messageHistorySchema;
