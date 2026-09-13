import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";

import useLoadingBar from "@hooks/useLoadingBar";
import useErrorAlert from "@hooks/useErrorAlert";
import { useUserContext } from "@context/UserContext";

import Label from "@components/form/Label";
import Input from "@components/form/input/Input";
import Button from "@components/ui/Button";
import DateField from "@components/form/DateField";
import CustomSelect from "@components/form/CustomSelect";

import countries from "@data/countries.json";
import countriesAndCities from "@data/countries+cities.json";
import interestOptions from "@data/interestOptions.js";

import { backEndUrl } from "@utils/constants";
import { formatISODate } from "@utils/dateUtils";
import { sleep } from "@utils/asyncUtils";

function toOption(value) {
  return {
    value,
    label: value,
  };
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default function CreateTravelPlan() {
  const navigate = useNavigate();

  const { emailNotification } = useUserContext();

  const [formState, setFormState] = useState({
    planName: "",
    startDate: null,
    endDate: null,
    toCountry: "",
    toCity: "",
    interests: [],
  });

  const [fieldError, setFieldError] = useState(null);

  const countryCityOptionMap = useMemo(() => {
    const map = new Map();

    countriesAndCities.forEach((country) => {
      if (!country?.name) return;

      const cities = Array.isArray(country.cities) ? country.cities : [];

      const cityOptions = [...new Set(cities)].filter(Boolean).map(toOption);

      map.set(normalize(country.name), cityOptions);
    });

    return map;
  }, []);

  const cityOptions = useMemo(() => {
    if (!formState.toCountry) return [];

    return countryCityOptionMap.get(normalize(formState.toCountry)) || [];
  }, [formState.toCountry, countryCityOptionMap]);

  const updateFormState = useCallback(
    (name, value) => {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "toCountry" ? { toCity: "" } : {}),
      }));

      if (fieldError?.field === name) {
        setFieldError(null);
      }
    },
    [fieldError],
  );

  const mutation = useMutation({
    mutationFn: async (data) => {
      await sleep(100);

      const res = await axios.post(
        `${backEndUrl}/task/createTask`,
        { ...data, emailNotification },
        {
          withCredentials: true,
        },
      );

      return res.data;
    },

    onSuccess: (res) => {
      setFieldError(null);

      const id = res.data;
      navigate(`/view-travel-plan/${id}`);
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
          message: issue.msg,
          field: null,
        });
      } else {
        setFieldError(null);
      }
    },
  });

  function submit(e) {
    e.preventDefault();

    const data = {
      ...formState,
      startDate: formatISODate(formState.startDate),
      endDate: formatISODate(formState.endDate),
    };

    mutation.mutate(data);
  }

  const anyError = mutation.error || null;

  const isLoading = mutation.isPending;

  const isAnyError = mutation.isError;

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
      <LoadingBar
        ref={loadingBarRef}
        color="#2563eb"
        height={5}
        shadow={false}
      />

      <div className="w-full min-h-[90%] flex items-center justify-center px-4 py-6 bg-transparent">
        <div
          className="w-full max-w-5xl rounded-3xl border border-gray-200 bg-white p-6 
        shadow-sm sm:p-8 lg:p-10 dark:border-white/[0.08] dark:bg-white/[0.03]"
        >
          <div className="mb-8 border-b border-gray-100 pb-6 dark:border-white/[0.08]">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white/90">
              Create Travel Plan
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Fill in your trip details and we&apos;ll help generate a plan for
              you.
            </p>
          </div>

          <form onSubmit={submit}>
            {/* Plan Name */}
            <div className="mb-6">
              <Label
                htmlFor="planName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Plan Name
              </Label>

              <Input
                type="text"
                id="planName"
                name="planName"
                placeholder="Enter a name for your trip plan"
                value={formState.planName}
                onChange={(e) => {
                  const { name, value } = e.target;
                  updateFormState(name, value);
                }}
                disabled={isLoading}
                error={fieldError?.field === "planName"}
                className="mt-2 h-12 rounded-xl bg-white dark:bg-white/[0.03] dark:placeholder:text-gray-500"
              />
            </div>

            {/* Dates */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label
                  htmlFor="startDate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Arrival Date
                </Label>

                <DateField
                  id="startDate"
                  name="startDate"
                  formState={formState}
                  setFormState={updateFormState}
                  disabled={isLoading}
                  error={fieldError?.field === "startDate"}
                  className="mt-2 h-12 rounded-xl border border-gray-300 
                  bg-white px-4 text-sm text-gray-900 placeholder:text-gray-500 
                  focus:border-blue-500 focus:ring-blue-500 dark:border-white/[0.08] 
                  dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label
                  htmlFor="endDate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Leave Date
                </Label>

                <DateField
                  id="endDate"
                  name="endDate"
                  formState={formState}
                  setFormState={updateFormState}
                  disabled={isLoading}
                  error={fieldError?.field === "endDate"}
                  className="mt-2 h-12 rounded-xl border border-gray-300 
                  bg-white px-4 text-sm text-gray-900 placeholder:text-gray-500 
                  focus:border-blue-500 focus:ring-blue-500 dark:border-white/[0.08] dark:bg-white/[0.03] 
                  dark:text-white/90 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Countries and Cities */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <CustomSelect
                label="To Country"
                name="toCountry"
                value={formState.toCountry}
                onChange={updateFormState}
                options={countries}
                placeholder="Select a country"
                disabled={isLoading}
                error={fieldError?.field === "toCountry"}
                className="text-sm"
                labelClassName="text-sm font-medium text-gray-700 dark:text-gray-300"
              />

              <CustomSelect
                label="To City"
                name="toCity"
                value={formState.toCity}
                onChange={updateFormState}
                options={cityOptions}
                placeholder={
                  formState.toCountry
                    ? cityOptions.length > 0
                      ? "Search or select a city"
                      : "No cities found"
                    : "Select a country first"
                }
                disabled={isLoading}
                error={fieldError?.field === "toCity"}
                limitOptions
                maxOptions={100}
                className="text-sm"
                labelClassName="text-sm font-medium text-gray-700 dark:text-gray-300"
              />
            </div>

            {/* Interests */}
            <div className="mb-8">
              <CustomSelect
                label="Interest"
                name="interests"
                isMulti
                value={formState.interests}
                onChange={updateFormState}
                options={interestOptions}
                disabled={isLoading}
                error={fieldError?.field === "interests"}
                className="text-sm"
                labelClassName="text-sm font-medium text-gray-700 dark:text-gray-300"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-blue-600 px-8 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Generating..." : "Generate Plan"}
            </Button>

            {fieldError && (
              <p className="mt-3 text-sm text-red-500">{fieldError.message}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
