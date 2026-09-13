import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

import { useUserContext } from "@context/UserContext";
import useErrorAlert from "@hooks/useErrorAlert";
import useLoadingBar from "@hooks/useLoadingBar";

import ComponentCard from "@components/common/ComponentCard";
import Switch from "@components/form/Switch";
import Modal from "@components/common/modal/Modal";
import DeleteModal from "@components/common/modal/DeleteModal";

import { getSettingsConfig } from "@utils/settingConfig";
import { sleep } from "@utils/asyncUtils";

export default function UserSetting() {
  const navigate = useNavigate();

  const {
    theme,
    confirmDelete,
    emailNotification,
    setTheme,
    providerId,
    clearAuth,
    setEmailNotification,
    setConfirmDelete,
  } = useUserContext();

  const settings = useMemo(() => {
    return getSettingsConfig({
      emailNotification,
      theme,
      setTheme,
      confirmDelete,
      navigate,
      providerId,
      clearAuth,
      setEmailNotification,
      setConfirmDelete,
    });
  }, [
    emailNotification,
    theme,
    confirmDelete,
    navigate,
    providerId,
    clearAuth,
    setTheme,
    setEmailNotification,
    setConfirmDelete,
  ]);

  const settingsMutation = useMutation({
    mutationFn: async ({ fn, value }) => {
      await sleep(200);
      return await fn(value);
    },

    onSuccess: (data) => {
      if (data && "isAuthenticated" in data && !data.isAuthenticated) {
        clearAuth();
      }
    },

    onError: (err) => {
      console.error("Setting Mutation Failed:", err);
    },
  });

  const isLoading = settingsMutation.isPending;

  const isAnyError = settingsMutation.isError;

  const anyError = settingsMutation.error || null;

  useErrorAlert({
    error: anyError,
    isAnyError,
  });

  const loadingBarRef = useLoadingBar({
    isLoading,
    isAnyError,
  });

  return (
    <>
      <div className="md:ml-[25%] md:mr-[25%] pb-6 flex h-full bg-transparent text-gray-900 dark:text-white/90">
        {isLoading && (
          <LoadingBar
            ref={loadingBarRef}
            color="#2563eb"
            height={5}
            shadow={false}
          />
        )}

        <ComponentCard
          isSearch={false}
          title="Setting"
          className="w-full overflow-y-auto max-h-[95%] border border-gray-200 bg-white text-gray-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/90"
        >
          {settings.map((setting, index) => {
            return (
              <div key={index}>
                <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8">
                  <div className="md:w-[75%] mr-10">
                    <h1 className="break-words font-medium text-gray-900 dark:text-white/90">
                      {setting.title}
                    </h1>

                    <div className="my-1"></div>

                    <p className="break-all text-[0.9rem] text-gray-500 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>

                  {setting.toggle ? (
                    <Switch
                      disabled={isLoading}
                      defaultChecked={setting.value}
                      onChange={(val) => {
                        if (setting.useMutate) {
                          settingsMutation.mutate({
                            fn: setting.fn,
                            value: val,
                          });
                        } else {
                          setting.fn(val);
                        }
                      }}
                    />
                  ) : setting.useModal ? (
                    <Modal
                      useCustomButton={false}
                      className="flex h-[2.75rem] w-[6rem] items-center justify-center rounded-lg border border-gray-300 bg-gray-700 px-3 text-center text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.08]"
                      ariaLabel="Delete trip"
                      ModalInterface={DeleteModal}
                      modalText={setting.modalText}
                      disabled={isLoading}
                      fn={() => {
                        if (setting.useMutate) {
                          settingsMutation.mutate({
                            fn: setting.fn,
                          });
                        } else {
                          setting.fn();
                        }
                      }}
                    >
                      <span>{setting.buttonText}</span>
                    </Modal>
                  ) : (
                    <button
                      type="button"
                      disabled={isLoading}
                      className="flex h-[2.75rem] w-[6rem] items-center justify-center rounded-lg border border-gray-300 bg-gray-700 px-3 text-center text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.08]"
                      onClick={() => {
                        if (setting.useMutate) {
                          settingsMutation.mutate({
                            fn: setting.fn,
                          });
                        } else {
                          setting.fn();
                        }
                      }}
                    >
                      <span>{setting.buttonText}</span>
                    </button>
                  )}
                </div>

                {index + 1 !== settings.length && (
                  <div className="my-4 border-t border-gray-200 dark:border-white/[0.08]" />
                )}
              </div>
            );
          })}
        </ComponentCard>
      </div>
    </>
  );
}
