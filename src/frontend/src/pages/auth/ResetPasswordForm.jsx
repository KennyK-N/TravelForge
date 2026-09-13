import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { backEndUrl } from "@utils/constants";

import Label from "@components/form/Label";
import Input from "@components/form/input/Input";
import Button from "@components/ui/Button";
import { EyeCloseIcon, EyeIcon, ChevronLeftIcon } from "@icons";

async function resetPassword(data) {
  const res = await axios.post(`${backEndUrl}/auth/reset-password`, data, {
    withCredentials: true,
  });

  return res.data;
}

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const urlError = searchParams.get("error");

  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const [fieldError, setFieldError] = useState(null);

  function updateFormState(key, value) {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (fieldError?.field === key) {
      setFieldError(null);
    }
  }

  const mutation = useMutation({
    mutationFn: resetPassword,

    onSuccess: () => {
      setFieldError(null);
      navigate("/sign-in");
    },

    onError: (error) => {
      const issue = error.response?.data;

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
          message: "Something went wrong",
        });
      }
    },
  });

  function submit(e) {
    e.preventDefault();

    mutation.mutate({
      token,
      newPassword: formState.password,
      confirmPassword: formState.confirmPassword,
    });
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Link
        to="/sign-in"
        className="inline-flex items-center mb-6 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
      >
        <ChevronLeftIcon className="size-5" />
        Back to login
      </Link>
      <div>
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Reset Password
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={submit}>
          <div className="space-y-5">
            {/* New Password */}
            <div>
              <Label>
                New Password<span className="text-error-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  type={formState.showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter new password"
                  value={formState.password}
                  onChange={(e) => updateFormState("password", e.target.value)}
                  error={fieldError?.field === "newPassword"}
                />

                <span
                  onClick={() =>
                    updateFormState("showPassword", !formState.showPassword)
                  }
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {formState.showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label>
                Confirm Password<span className="text-error-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  type={formState.showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formState.confirmPassword}
                  onChange={(e) =>
                    updateFormState("confirmPassword", e.target.value)
                  }
                  error={fieldError?.field === "confirmPassword"}
                />

                <span
                  onClick={() =>
                    updateFormState(
                      "showConfirmPassword",
                      !formState.showConfirmPassword,
                    )
                  }
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {formState.showConfirmPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full px-4 py-3 text-white bg-brand-500 hover:bg-brand-600"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </div>

            {(urlError || fieldError?.message) && (
              <p className="text-error-500 text-sm whitespace-normal break-words leading-relaxed mb-2">
                {fieldError?.message || "Invalid or missing reset token"}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
