import { z } from "zod";

const authBaseSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),

  email: z.string().trim().email({
    message: "Invalid email address",
  }),

  password: z.string().trim().min(1, {
    message: "Password is required",
  }),

  currentPassword: z.string().trim().min(1, {
    message: "Current password is required",
  }),

  newPassword: z
    .string()
    .trim()
    .min(8, {
      message: "Password must be greater than or equal to 8 characters",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),

  confirmPassword: z.string().trim(),
});

function passwordConfirmation(schema) {
  return schema.superRefine((data, ctx) => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Confirmation Password must match the new password",
      });
    }
  });
}

const authSchema = {
  signIn: authBaseSchema.pick({
    email: true,
    password: true,
  }),

  signUp: passwordConfirmation(
    authBaseSchema.pick({
      name: true,
      email: true,
      newPassword: true,
      confirmPassword: true,
    }),
  ),

  changePassword: passwordConfirmation(
    authBaseSchema.pick({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    }),
  ),

  forgotPassword: authBaseSchema.pick({
    email: true,
  }),

  resetPassword: passwordConfirmation(
    authBaseSchema.pick({
      newPassword: true,
      confirmPassword: true,
    }),
  ),
};

export default authSchema;
