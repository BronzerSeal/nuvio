import { useMutation, useQuery } from "@tanstack/react-query";
import { getCompanyTimeline } from "../model/get-timeline";
import { CreateTimelineRow } from "../model/create-timeline-row";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import { queryClient } from "@/shared/lib/query-client";
import { getTimelineRows } from "../model/get-timeline-rows";

export const useCompanyTimeline = (companyId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["company-timeline"],
    queryFn: () => getCompanyTimeline(companyId),
    enabled,
  });
};

export const useCreateTimelineRow = () => {
  return useMutation({
    mutationKey: ["create-timeline-row"],
    mutationFn: ({
      timelineId,
      rowName,
    }: {
      timelineId: string;
      rowName: string;
    }) => CreateTimelineRow(timelineId, rowName),

    onSuccess: () => {
      toast.success("Row created");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeline-rows"],
      });
    },
  });
};

export const useTimelineRows = (timelineId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["timeline-rows"],
    queryFn: () => getTimelineRows(timelineId),
    enabled,
  });
};
