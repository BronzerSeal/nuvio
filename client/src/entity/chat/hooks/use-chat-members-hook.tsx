"use client";
import { useCallback, useRef } from "react";
import { useChatMembers } from "../queries/queries";

export const useChatMembersHook = (companyId: string, enabled: boolean) => {
  const {
    data: members,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMembers(companyId, enabled);

  const cursorRef = useIntersection(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  });

  const cursor = <div ref={cursorRef}></div>;

  return { members, isLoading, cursor };
};

export function useIntersection(onIntersect: () => void) {
  const unsubscribe = useRef(() => {});

  return useCallback(
    (el: HTMLDivElement | null) => {
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
    },
    [onIntersect],
  );
}
