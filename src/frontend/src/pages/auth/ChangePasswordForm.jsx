import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { useUserContext } from "@context/UserContext";
import { backEndUrl } from "@utils/constants";

import Label from "@components/form/Label";
import Input from "@components/form/input/Input";
import Button from "@components/ui/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const { clearAuth } = useUserContext();

  const [formState, setFormState] = useState({
    showCurrentPassword: false,
    showPassword: false,
    showConfirmPassword: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  async function changePassword(data) {
    const res = await axios.post(`${backEndUrl}/auth/change-password`, data, {
      withCredentials: true,
    });
    return res.data;
  }

  const mutation = useMutation({
    mutationFn: changePassword,

    onSuccess: () => {
      setFieldError(null);

      clearAuth();
      navigate("/sign-in", { replace: true });
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

  function submit(e) {
    e.preventDefault();

    mutation.mutate({
      currentPassword: formState.currentPassword,
      newPassword: formState.newPassword,
      confirmPassword: formState.confirmPassword,
    });
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Link
        to="/setting"
        className="inline-flex items-center mb-6 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
      >
        <ChevronLeftIcon className="size-5" />
        Back to setting
      </Link>
      <div>
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Change Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>
        <form onSubmit={submit}>
          <div className="space-y-5">
            {/* Current Password */}
            <div>
              <Label>
                Current Password<span className="text-error-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  type={formState.showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  name="currentPassword"
                  value={formState.currentPassword}
                  onChange={(e) =>
                    updateFormState("currentPassword", e.target.value)
                  }
                  error={fieldError?.field === "currentPassword"}
                />

                <span
                  onClick={() =>
                    updateFormState(
                      "showCurrentPassword",
                      !formState.showCurrentPassword,
                    )
                  }
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {formState.showCurrentPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>
            {/* New Password */}
            <div>
              <Label>
                New Password<span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={formState.showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  name="newPassword"
                  value={formState.newPassword}
                  onChange={(e) =>
                    updateFormState("newPassword", e.target.value)
                  }
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
                  placeholder="Confirm new password"
                  name="confirmPassword"
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

            {/* Button */}
            <div>
              <Button
                type="submit"
                className="w-full px-4 py-3 text-white bg-brand-500 hover:bg-brand-600"
              >
                Reset Password
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
    </div>
  );
}
