/* eslint-disable react-refresh/only-export-components */

import { useState, createContext, useContext, useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getAuthAndSettings } from "@services/getAuthAndSettings";

const THEME_NAME = "theme";

const themes = ["light", "dark"];

const UserContext = createContext(null);

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used inside UserProvider");
  }

  return context;
}

function getSafeTheme(value) {
  return themes.includes(value) ? value : themes[0];
}

export function UserProvider({ children }) {
  const queryClient = useQueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [theme, setTheme] = useState(() =>
    getSafeTheme(localStorage.getItem(THEME_NAME)),
  );

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [emailNotification, setEmailNotification] = useState(false);
  const [providerId, setProviderId] = useState("");

  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const result = await getAuthAndSettings();

      if (!result.success) {
        return null;
      }

      return result.data;
    },
    retry: 20,
    retryDelay: 3000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!authQuery.data) return;

    const { theme, confirmDelete, emailNotification, providerId } =
      authQuery.data.userSetting.data;

    const userInfo = authQuery.data.userInfo.user;

    authenticate({
      userInfo,
      confirmDelete,
      theme,
      emailNotification,
      providerId,
    });
  }, [authQuery.data]);

  function clearAuth() {
    setUserInfo({});
    setIsAuthenticated(false);
    setConfirmDelete(false);
    setEmailNotification(false);
    setProviderId("");
    queryClient.clear();
  }

  function authenticate({
    userInfo,
    confirmDelete = false,
    theme = themes[0],
    emailNotification = false,
    providerId = "",
  }) {
    setUserInfo(userInfo ?? {});
    setConfirmDelete(Boolean(confirmDelete));
    setIsAuthenticated(true);
    setTheme(getSafeTheme(theme));
    setEmailNotification(Boolean(emailNotification));
    setProviderId(providerId);
  }

  useEffect(() => {
    localStorage.setItem(THEME_NAME, theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading: authQuery.isLoading,
        isAuthError: authQuery.isError,
        authErrorMsg: authQuery.error?.message || "",

        userInfo,
        confirmDelete,
        emailNotification,
        theme,
        providerId,

        setTheme,
        setConfirmDelete,
        setEmailNotification,
        authenticate,
        clearAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
