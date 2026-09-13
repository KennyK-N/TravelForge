import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";
import { ArrowDownAZ, CalendarDays } from "lucide-react";

import { useAlertContext } from "@context/AlertContext";
import { useUserContext } from "@context/UserContext";
import useInfiniteScrolling from "@hooks/useInfiniteScroll";
import useLoadingBar from "@hooks/useLoadingBar";
import useErrorAlert from "@hooks/useErrorAlert";

import ItemCard from "@components/common/ItemCard";
import Spinner from "@components/common/Spinner";

import { backEndUrl } from "@utils/constants";
import { formatDate, formatISODate } from "@utils/dateUtils";

const LIMIT = 5;

export default function Home() {
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const queryClient = useQueryClient();
  const { showAlert } = useAlertContext();
  const { confirmDelete } = useUserContext();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ["taskHome"],

    queryFn: async ({ pageParam }) => {
      const res = await axios.get(`${backEndUrl}/task/getTasks`, {
        params: {
          page: pageParam,
          limit: LIMIT,
        },
        withCredentials: true,
      });

      const response = res.data;
      const task = response.data;

      return {
        data: task,
        nextPage: task.length === LIMIT ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  function invalidateQueryCache() {
    queryClient.invalidateQueries({
      queryKey: ["plans"],
    });

    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });

    queryClient.invalidateQueries({
      queryKey: ["osrmRoute"],
    });
  }

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`${backEndUrl}/task/deleteTask`, {
        params: { taskId: id },
        withCredentials: true,
      });

      return res.data;
    },

    onSuccess: async (data, id) => {
      await queryClient.cancelQueries({ queryKey: ["taskHome"] });

      queryClient.setQueryData(["taskHome"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((task) => task.id !== id),
          })),
        };
      });
      showAlert("Travel plan deleted successfully.", "success");
    },

    onSettled: () => {
      invalidateQueryCache();
    },
  });

  const { observerTarget } = useInfiniteScrolling(
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  );

  const itemsFlatten = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const items = useMemo(() => {
    const formattedItems = itemsFlatten.map((item) => ({
      ...item,
      startDate: formatISODate(item.startDate),
      endDate: formatISODate(item.endDate),
      createdAt: formatDate(item.createdAt, true),
      rawCreatedAt: item.createdAt,
    }));

    return formattedItems.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortBy === "name") {
        return direction * a.planName.localeCompare(b.planName);
      }

      if (sortBy === "createdAt") {
        return (
          direction * (new Date(a.rawCreatedAt) - new Date(b.rawCreatedAt))
        );
      }

      return 0;
    });
  }, [itemsFlatten, sortBy, sortDirection]);

  function toggleSort(type) {
    if (sortBy === type) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(type);
      setSortDirection(type === "name" ? "asc" : "desc");
    }
  }

  function deleteTask(id) {
    deleteMutation.mutate(id);
  }

  const anyError = deleteMutation?.error || error || null;

  const isLoading = isPending || isFetchingNextPage || deleteMutation.isPending;

  const isAnyError = isError || isFetchNextPageError || deleteMutation.isError;

  useErrorAlert({ error: anyError, isAnyError });

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

      <div className="min-h-full bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => toggleSort("name")}
            className={`inline-flex w-44 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition
      ${
        sortBy === "name"
          ? "border-blue-500 bg-blue-600 text-white hover:bg-blue-700"
          : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500/60 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
      }`}
          >
            <ArrowDownAZ size={17} />
            Name {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>

          <button
            type="button"
            onClick={() => toggleSort("createdAt")}
            className={`inline-flex w-44 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition
      ${
        sortBy === "createdAt"
          ? "border-blue-500 bg-blue-600 text-white hover:bg-blue-700"
          : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500/60 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
      }`}
          >
            <CalendarDays size={17} />
            Created Date{" "}
            {sortBy === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
        </div>
        <div
          className="
          grid
          grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
          md:grid-cols-[repeat(auto-fit,minmax(600px,1fr))]
          gap-6
          md:ml-4
        "
        >
          {items.map((item) => (
            <ItemCard
              key={item.id}
              trip={{
                id: item.id,
                name: item.planName,
                city: item.toCity,
                country: item.toCountry,
                fromDate: item.startDate,
                toDate: item.endDate,
                createdAt: item.createdAt,
              }}
              onDelete={() => deleteTask(item.id)}
              isLoading={isLoading}
              confirmDelete={confirmDelete}
              onClick={(id) => navigate(`/view-travel-plan/${id}`)}
            />
          ))}
        </div>

        {hasNextPage && <div ref={observerTarget} className="h-20" />}

        {isLoading && (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
}
