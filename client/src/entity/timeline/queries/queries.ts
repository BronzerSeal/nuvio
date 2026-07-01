import { useMutation, useQuery } from "@tanstack/react-query";
import { getCompanyTimeline } from "../model/get-timeline";
import { CreateTimelineRow } from "../model/create-timeline-row";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import { queryClient } from "@/shared/lib/query-client";
import { getTimelineRows } from "../model/get-timeline-rows";
import { createTimelineTask } from "../model/create-timeline-task";
import { getTimelineTask } from "../model/get-timeline-tasks";
import { updateTimelineTask } from "../model/update-timeline-task";
import { DeleteTimelineRows } from "../model/delete-timeline-rows";
import { DeleteTimelineTasks } from "../model/delete-timeline-tasks";

export const useCompanyTimeline = (companyId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["company-timeline", companyId],
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

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["timeline-rows", variables.timelineId],
      });
    },
  });
};

export const useTimelineRows = (timelineId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["timeline-rows", timelineId],
    queryFn: () => getTimelineRows(timelineId),
    enabled,
  });
};

export const useCreateTimelineTask = () => {
  return useMutation({
    mutationKey: ["create-timeline-row"],
    mutationFn: ({
      timelineId,
      rowId,
      startTime,
      duration,
      title,
      type,
      attendees,
    }: {
      timelineId: string;
      rowId: string;
      startTime: string;
      duration: number;
      title: string;
      type: "meeting" | "workshop" | "break" | "review";
      attendees: number;
    }) =>
      createTimelineTask(
        timelineId,
        rowId,
        startTime,
        duration,
        title,
        type,
        attendees,
      ),

    onSuccess: () => {
      toast.success("Task created");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["timeline-tasks", variables.timelineId],
      });
    },
  });
};

export const useTimelineTasks = (timelineId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["timeline-tasks", timelineId],
    queryFn: () => getTimelineTask(timelineId),
    enabled,
  });
};

export const useUpdateTimelineTask = () => {
  return useMutation({
    mutationKey: ["update-timeline-task"],
    mutationFn: ({
      timelineId,
      taskId,
      rowId,
      startTime,
    }: {
      timelineId: string;
      taskId: string;
      rowId: string;
      startTime: string;
    }) => updateTimelineTask(timelineId, taskId, startTime, rowId),

    onSuccess: () => {
      toast.success("Task updated");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["timeline-tasks", variables.timelineId],
      });
    },
  });
};

export const useDeleteTimelineRows = () => {
  return useMutation({
    mutationKey: ["delete-timeline-rows"],
    mutationFn: ({
      timelineId,
      rowIds,
    }: {
      timelineId: string;
      rowIds: string[];
    }) => DeleteTimelineRows(timelineId, rowIds),

    onSuccess: () => {
      toast.success("Rows deleted");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["timeline-rows", variables.timelineId],
      });
    },
  });
};

export const useDeleteTimelineTasks = () => {
  return useMutation({
    mutationKey: ["delete-timeline-tasks"],
    mutationFn: ({
      timelineId,
      taskIds,
    }: {
      timelineId: string;
      taskIds: string[];
    }) => DeleteTimelineTasks(timelineId, taskIds),

    onSuccess: () => {
      toast.success("Tasks deleted");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["timeline-tasks", variables.timelineId],
      });
    },
  });
};
