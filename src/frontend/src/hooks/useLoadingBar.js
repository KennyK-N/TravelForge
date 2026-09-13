import { useEffect, useRef } from "react";

export default function useLoadingBar({ isLoading, isAnyError }) {
  const loadingBarRef = useRef(null);

  useEffect(() => {
    if (isAnyError) {
      loadingBarRef.current?.complete();
      return;
    }

    if (isLoading) {
      loadingBarRef.current?.continuousStart();
    } else {
      loadingBarRef.current?.complete();
    }
  }, [isLoading, isAnyError]);

  return loadingBarRef;
}
