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
      description: "descriptionaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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
      description: "",
      toggle: true,
      buttonText: null,
      useMutate: true,
      value: theme === "dark",
      fn: (val) => updateTheme(val, setTheme),
    },
    {
      title: "Enable Confirm before delete",
      description: "descriptionaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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
      description: "descriptionaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      toggle: false,
      buttonText: "Delete Account",
      useMutate: true,
      useModal: true,
      modalText: "Do you want to delete your account?",
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
              "descriptionaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa Non google oauth account might not use google oauth",
            toggle: false,
            buttonText: "Change Password",
            useMutate: false,
            fn: () => {
              navigate("/change-password");
            },
          },
        ]
      : []),
    {
      title: "Clear Data",
      description: "description",
      toggle: false,
      buttonText: "Clear Data",
      useMutate: true,
      useModal: true,
      modalText: "Do you want to delete all of your tasks?",
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
      description: "description",
      toggle: false,
      buttonText: "Report Crash",
      useMutate: false,
      fn: () => {
        window.location.href = "mailto:kennykwan903@gmail.com";
      },
    },
  ];
}
