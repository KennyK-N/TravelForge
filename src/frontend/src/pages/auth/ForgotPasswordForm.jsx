import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { backEndUrl } from "@utils/constants";

import Label from "@components/form/Label";
import Input from "@components/form/input/Input";
import Button from "@components/ui/Button";
import { ChevronLeftIcon } from "@icons";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState(null);

  async function forgotPassword(data) {
    const res = await axios.post(`${backEndUrl}/auth/forgot-password`, data, {
      withCredentials: true,
    });

    return res.data;
  }

  const mutation = useMutation({
    mutationFn: forgotPassword,

    onSuccess: () => {
      setFieldError(null);
    },

    onError: (err) => {
      const issue = err.response?.data;

      if (issue?.data?.path?.length) {
        setFieldError({
          field: issue.data.path[0],
          message: issue.data.message,
        });
      } else if (issue?.msg) {
        setFieldError({
          field: null,
          message: issue.msg,
        });
      } else {
        setFieldError({
          field: null,
          message: err.message || "Something went wrong",
        });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate({
      email,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Link
        to="/sign-in"
        className="inline-flex items-center mb-6 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
      >
        <ChevronLeftIcon className="size-5" />
        Back to login
      </Link>

      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <Label>
              Email<span className="text-error-500">*</span>
            </Label>

            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldError?.field === "email"}
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full px-4 py-3 text-white bg-brand-500 hover:bg-brand-600"
            >
              {mutation.isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>

          {fieldError?.message && (
            <div className="mt-5">
              <p className="text-error-500 text-sm whitespace-normal break-words leading-relaxed mb-2">
                {fieldError.message}
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
