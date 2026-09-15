import axios from "axios";

import { backEndUrl } from "@utils/constants";
import updateTheme from "@services/updateTheme";

export function getSettingsConfig({
  emailNotification,
  theme,
  setTheme,
  setConfirmDelete,
  setEmailNotification,
  confirmDelete,
  navigate,
  providerId,
}) {
  return [
    {
      title: "Enable Email Notification",
      description:
        "Get notified by email about upcoming trips on your account.",
      toggle: true,
      buttonText: null,
      useMutate: true,
      value: emailNotification,
      fn: async (val) => {
        const res = await axios.patch(
          `${backEndUrl}/setting/updateEmailNotification`,
          { emailNotification: val },
          {
            withCredentials: true,
          },
        );
        const response = res.data;
        setEmailNotification(response.data.emailNotification);

        return response;
      },
    },
    {
      title: "Enable Dark Mode",
      description:
        "Switch to a darker color scheme that's generally easier on the eyes.",
      toggle: true,
      buttonText: null,
      useMutate: true,
      value: theme === "dark",
      fn: (val) => updateTheme(val, setTheme),
    },
    {
      title: "Enable Confirm before delete",
      description:
        "Show a confirmation prompt before anything gets deleted, so you don't lose data by accident.",
      toggle: true,
      buttonText: null,
      useMutate: true,
      value: confirmDelete,
      fn: async (val) => {
        const res = await axios.patch(
          `${backEndUrl}/setting/updateConfirmDelete`,
          { confirmDelete: val },
          {
            withCredentials: true,
          },
        );
        const response = res.data;
        setConfirmDelete(response.data.confirmDelete);

        return response;
      },
    },
    {
      title: "Delete Account",
      description:
        "Permanently delete your account and all associated data. This action cannot be undone.",
      buttonText: "Delete Account",
      modalText: "Do you want to delete your account?",
      toggle: false,
      useMutate: true,
      useModal: true,
      fn: async () => {
        const res = await axios.delete(`${backEndUrl}/auth/delete-account`, {
          withCredentials: true,
        });

        const data = res.data;
        return data;
      },
    },
    ...(providerId !== "google"
      ? [
          {
            title: "Change Password",
            description:
              "Update the password you use to sign in. This option isn't available if you signed up using Google.",
            buttonText: "Change Password",
            toggle: false,
            useMutate: false,
            fn: () => {
              navigate("/change-password");
            },
          },
        ]
      : []),
    {
      title: "Clear Data",
      description:
        "Delete all of your tasks. Your account and settings will remain untouched.",
      buttonText: "Clear Data",
      modalText: "Do you want to delete all of your tasks?",
      toggle: false,
      useMutate: true,
      useModal: true,
      fn: async () => {
        const res = await axios.delete(`${backEndUrl}/task/deleteAllTasks`, {
          withCredentials: true,
        });

        const response = res.data;
        return response;
      },
    },
    {
      title: "Report Crash",
      description:
        "Ran into a bug or crash? Send us an email and we'll look into it.",
      buttonText: "Report Crash",
      toggle: false,
      useMutate: false,
      fn: () => {
        window.location.href = `mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`;
      },
    },
  ];
}
