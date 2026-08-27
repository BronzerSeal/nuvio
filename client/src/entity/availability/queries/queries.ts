import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTimeSpans } from "../model/get-time-spans";
import { getCompanyAvailability } from "../model/get-availability";
import { createTimeSpan } from "../model/create-time-span";
import { toast } from "sonner";
import { updateTimeSpan } from "../model/update-time-span";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import { deleteTimeSpan } from "../model/delete-time-span";
import { TimeSpan } from "@/shared/types/bd-types";

type TimeSpanCacheItem = TimeSpan & {
  availabilityId?: string;
  optimistic?: boolean;
  locallyCreatedAt?: number;
};

const LOCALLY_CREATED_TIMESPAN_TTL = 15_000;

const isSameTimeSpanSlot = (a: TimeSpanCacheItem, b: TimeSpanCacheItem) =>
  a.week_day === b.week_day &&
  a.start_time === b.start_time &&
  a.end_time === b.end_time;

const mergeLocalTimeSpans = (
  oldData: TimeSpanCacheItem[] | undefined,
  newData: TimeSpanCacheItem[],
) => {
  if (!oldData) return newData;

  const now = Date.now();
  const localTimeSpans = oldData.filter((span) => {
    const isFreshLocalSpan =
      span.optimistic ||
      (span.locallyCreatedAt !== undefined &&
        now - span.locallyCreatedAt < LOCALLY_CREATED_TIMESPAN_TTL);

    if (!isFreshLocalSpan) return false;

    return !newData.some(
      (newSpan) =>
        newSpan.id === span.id || isSameTimeSpanSlot(newSpan, span),
    );
  });

  return [...newData, ...localTimeSpans];
};

export const useTimeSpans = (availabilityId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["availability-time-spans", availabilityId],
    queryFn: () => getTimeSpans(availabilityId),
    enabled,
    structuralSharing: (oldData, newData) =>
      mergeLocalTimeSpans(
        oldData as TimeSpanCacheItem[] | undefined,
        newData as TimeSpanCacheItem[],
      ),
  });
};

export const useCompanyAvailability = (companyId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["availability", companyId],
    queryFn: () => getCompanyAvailability(companyId),
    enabled,
  });
};
export const useCreateTimeSpan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-time-span"],

    mutationFn: ({
      availabilityId,
      week_day,
      start_time,
      end_time,
      active,
    }: {
      availabilityId: string;
      week_day: number;
      start_time: string;
      end_time: string;
      active?: boolean;
    }) =>
      createTimeSpan(availabilityId, week_day, start_time, end_time, active),

    onMutate: async (newTimeSpan) => {
      await queryClient.cancelQueries({
        queryKey: ["availability-time-spans", newTimeSpan.availabilityId],
      });

      const previousTimeSpans = queryClient.getQueryData([
        "availability-time-spans",
        newTimeSpan.availabilityId,
      ]);

      const optimisticTimeSpan = {
        id: crypto.randomUUID(),
        availabilityId: newTimeSpan.availabilityId,
        week_day: newTimeSpan.week_day,
        start_time: newTimeSpan.start_time,
        end_time: newTimeSpan.end_time,
        active: newTimeSpan.active ?? true,
        optimistic: true,
        locallyCreatedAt: Date.now(),
      };

      queryClient.setQueryData(
        ["availability-time-spans", newTimeSpan.availabilityId],
        (old: any[]) => {
          if (!old) return [optimisticTimeSpan];

          return [...old, optimisticTimeSpan];
        },
      );

      return {
        previousTimeSpans,
        optimisticId: optimisticTimeSpan.id,
      };
    },

    onSuccess: (data, vars, context) => {
      queryClient.setQueryData(
        ["availability-time-spans", vars.availabilityId],
        (old: any[]) => {
          if (!old) return old;

          return old.map((span) =>
            span.id === context?.optimisticId
              ? { ...data, locallyCreatedAt: Date.now() }
              : span,
          );
        },
      );

      toast.success("Time span created");
    },

    onError: (err, vars, context) => {
      if (context?.previousTimeSpans) {
        queryClient.setQueryData(
          ["availability-time-spans", vars.availabilityId],
          context.previousTimeSpans,
        );
      }

      toast.error(getErrorMessage(err));
    },

    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["availability-time-spans", vars.availabilityId],
      });
    },
  });
};
export const useUpdateTimeSpan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-time-span"],

    mutationFn: ({
      availabilityId,
      timeSpanId,
      week_day,
      start_time,
      end_time,
      active,
    }: {
      availabilityId: string;
      timeSpanId: string;
      week_day?: number;
      start_time?: string;
      end_time?: string;
      active?: boolean;
    }) =>
      updateTimeSpan({
        availabilityId,
        timeSpanId,
        week_day,
        start_time,
        end_time,
        active,
      }),

    onMutate: async (updatedTimeSpan) => {
      await queryClient.cancelQueries({
        queryKey: ["availability-time-spans", updatedTimeSpan.availabilityId],
      });

      const previous = queryClient.getQueryData([
        "availability-time-spans",
        updatedTimeSpan.availabilityId,
      ]);

      queryClient.setQueryData(
        ["availability-time-spans", updatedTimeSpan.availabilityId],
        (old: any) => {
          if (!old) return old;

          return old.map((span: any) =>
            span.id === updatedTimeSpan.timeSpanId
              ? {
                  ...span,
                  ...(updatedTimeSpan.week_day !== undefined && {
                    week_day: updatedTimeSpan.week_day,
                  }),
                  ...(updatedTimeSpan.start_time !== undefined && {
                    start_time: updatedTimeSpan.start_time,
                  }),
                  ...(updatedTimeSpan.end_time !== undefined && {
                    end_time: updatedTimeSpan.end_time,
                  }),
                  ...(updatedTimeSpan.active !== undefined && {
                    active: updatedTimeSpan.active,
                  }),
                }
              : span,
          );
        },
      );

      return { previous };
    },

    onError: (_err, vars, ctx) => {
      queryClient.setQueryData(
        ["availability-time-spans", vars.availabilityId],
        ctx?.previous,
      );

      toast.error("Failed to update time span");
    },

    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["availability-time-spans", vars.availabilityId],
      });
    },
  });
};

export const useDeleteTimeSpan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-time-span"],

    mutationFn: ({
      availabilityId,
      timeSpanId,
    }: {
      availabilityId: string;
      timeSpanId: string;
    }) => deleteTimeSpan(availabilityId, timeSpanId),

    onMutate: async ({ availabilityId, timeSpanId }) => {
      await queryClient.cancelQueries({
        queryKey: ["availability-time-spans", availabilityId],
      });

      const previousTimeSpans = queryClient.getQueryData([
        "availability-time-spans",
        availabilityId,
      ]);

      queryClient.setQueryData(
        ["availability-time-spans", availabilityId],
        (old: any[]) => {
          if (!old) return old;

          return old.filter((timeSpan) => timeSpan.id !== timeSpanId);
        },
      );

      return {
        previousTimeSpans,
      };
    },

    onError: (err, { availabilityId }, context) => {
      if (context?.previousTimeSpans) {
        queryClient.setQueryData(
          ["availability-time-spans", availabilityId],
          context.previousTimeSpans,
        );
      }

      toast.error(getErrorMessage(err));
    },

    onSettled: (_, __, { availabilityId }) => {
      queryClient.invalidateQueries({
        queryKey: ["availability-time-spans", availabilityId],
      });
    },

    onSuccess: () => {
      toast.success("Time span deleted");
    },
  });
};
