"use client";
import { useCallback, useRef } from "react";
import { useCompanyTasks } from "../queries/queries";

export const useCompanyTasksHook = (companyId: string, enabled: boolean) => {
  const {
    data: tasks,
    isLoading,
    fetchNextPage,
    // hasNextPage,
    // isFetchingNextPage,
  } = useCompanyTasks(companyId, enabled);

  const cursorRef = useIntersection(() => {
    fetchNextPage();
  });

  const cursor = (
    <div ref={cursorRef}>
      {/* {isFetchingNextPage && <UserPostSkeleton />}
      {!hasNextPage && (
        <Chip className="text-2xl mt-2" color="danger" radius="sm">
          No posts yet
        </Chip>
      )} */}
    </div>
  );

  return { tasks, isLoading, cursor };
};

export function useIntersection(onIntersect: () => void) {
  const unsubscribe = useRef(() => {});

  return useCallback((el: HTMLDivElement | null) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((intersection) => {
        if (intersection.isIntersecting) {
          onIntersect();
        }
      });
    });

    if (el) {
      observer.observe(el);
      unsubscribe.current = () => observer.disconnect();
    } else {
      unsubscribe.current();
    }
  }, []);
}
