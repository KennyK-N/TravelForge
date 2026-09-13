import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";

import useLoadingBar from "@hooks/useLoadingBar";
import useErrorAlert from "@hooks/useErrorAlert";

import ComponentCard from "@components/common/ComponentCard";
import SearchPlan from "@components/search/SearchPlan";
import Spinner from "@components/common/Spinner";

import { backEndUrl } from "@utils/constants";

export default function Search() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["plans", "search", searchTerm],
    queryFn: async ({ queryKey }) => {
      const [, , searchTerm] = queryKey;

      const res = await axios.get(`${backEndUrl}/task/searchTaskIds`, {
        params: {
          planName: searchTerm,
        },
        withCredentials: true,
      });

      let response = res.data;
      response = response.data;

      return response;
    },
    enabled: searchTerm.trim() !== "",
  });

  const anyError = error || null;

  const isLoading = isPending;

  const isAnyError = isError;

  const loadingBarRef = useLoadingBar({
    isLoading,
    isAnyError,
  });

  useErrorAlert({ error: anyError, isAnyError });

  return (
    <>
      {searchTerm.trim() !== "" && (
        <LoadingBar
          ref={loadingBarRef}
          color="#2563eb"
          height={5}
          shadow={false}
        />
      )}

      <div className="md:ml-[10%] md:mr-[10%] md:pt-6 h-full bg-transparent">
        <ComponentCard
          isSearch={true}
          title="Search"
          className="w-full overflow-y-auto max-h-[95%] border border-gray-200 bg-white text-gray-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/90"
          onChange={setSearchTerm}
        >
          {searchTerm.trim() !== "" && isLoading && (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          )}

          {data?.length > 0 && (
            <SearchPlan
              plans={data}
              onClick={(id) => navigate(`/view-travel-plan/${id}`)}
            />
          )}
        </ComponentCard>
      </div>
    </>
  );
}
