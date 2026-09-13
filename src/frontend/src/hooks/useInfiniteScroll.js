import { useEffect, useRef } from "react";

export default function useInfiniteScrolling(
  fetchNextPage,
  loading,
  hasNextPage,
) {
  const observerTarget = useRef(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchNextPage();
        }
      },
      {
        threshold: 0,
      },
    );

    const target = observerTarget.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [fetchNextPage, loading, hasNextPage]);

  return {
    observerTarget,
  };
}
