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
import { TimelineRow, TimelineTask } from "@/shared/types/bd-types";

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

    onMutate: async (newRow) => {
      await queryClient.cancelQueries({
        queryKey: ["timeline-rows", newRow.timelineId],
      });

      const prev = queryClient.getQueryData<TimelineRow[]>([
        "timeline-rows",
        newRow.timelineId,
      ]);

      queryClient.setQueryData<TimelineRow[]>(
        ["timeline-rows", newRow.timelineId],
        (old) => {
          if (!old) return old;

          return [
            ...old,
            {
              id: `temp-${Date.now()}`,
              capacity: 0,
              label: newRow.rowName,
              timelineId: newRow.timelineId,
            },
          ];
        },
      );

      return { prev };
    },

    onError: (error, variables, context) => {
      toast.error(getErrorMessage(error));
      queryClient.setQueryData(
        ["timeline-rows", variables.timelineId],
        context?.prev,
      );
    },

    onSuccess: () => {
      toast.success("Row created");
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

    onMutate: async (newTask) => {
      await queryClient.cancelQueries({
        queryKey: ["timeline-tasks", newTask.timelineId],
      });

      const prev = queryClient.getQueryData<TimelineTask[]>([
        "timeline-tasks",
        newTask.timelineId,
      ]);

      queryClient.setQueryData<TimelineTask[]>(
        ["timeline-tasks", newTask.timelineId],
        (old) => {
          if (!old) return old;

          return [
            ...old,
            {
              id: `temp-${Date.now()}`,
              attendees: newTask.attendees,
              duration: newTask.duration,
              rowId: newTask.rowId,
              startTime: newTask.startTime,
              title: newTask.title,
              type: newTask.type,
            },
          ];
        },
      );

      return { prev };
    },

    onError: (error, variables, context) => {
      toast.error(getErrorMessage(error));
      queryClient.setQueryData(
        ["timeline-tasks", variables.timelineId],
        context?.prev,
      );
    },

    onSuccess: () => {
      toast.success("Task created");
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

    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({
        queryKey: ["timeline-tasks", updatedTask.timelineId],
      });

      const prev = queryClient.getQueryData<TimelineTask[]>([
        "timeline-tasks",
        updatedTask.timelineId,
      ]);

      queryClient.setQueryData<TimelineTask[]>(
        ["timeline-tasks", updatedTask.timelineId],
        (old) => {
          if (!old) return old;

          return old.map((task) =>
            task.id === updatedTask.taskId
              ? {
                  ...task,
                  rowId: updatedTask.rowId,
                  startTime: updatedTask.startTime,
                }
              : task,
          );
        },
      );

      return { prev };
    },

    onError: (error, variables, context) => {
      toast.error(getErrorMessage(error));
      queryClient.setQueryData(
        ["timeline-tasks", variables.timelineId],
        context?.prev,
      );
    },

    onSuccess: () => {
      toast.success("Task updated");
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

    onMutate: async (deletedRows) => {
      await queryClient.cancelQueries({
        queryKey: ["timeline-rows", deletedRows.timelineId],
      });

      const prev = queryClient.getQueryData<TimelineTask[]>([
        "timeline-rows",
        deletedRows.timelineId,
      ]);

      queryClient.setQueryData<TimelineTask[]>(
        ["timeline-rows", deletedRows.timelineId],
        (old) => {
          if (!old) return old;

          return old.filter((row) => !deletedRows.rowIds.includes(row.id));
        },
      );

      return { prev };
    },

    onError: (error, variables, context) => {
      toast.error(getErrorMessage(error));
      queryClient.setQueryData(
        ["timeline-rows", variables.timelineId],
        context?.prev,
      );
    },

    onSuccess: () => {
      toast.success("Rows deleted");
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

    onMutate: async (deletedTasks) => {
      await queryClient.cancelQueries({
        queryKey: ["timeline-tasks", deletedTasks.timelineId],
      });

      const prev = queryClient.getQueryData<TimelineTask[]>([
        "timeline-tasks",
        deletedTasks.timelineId,
      ]);

      queryClient.setQueryData<TimelineTask[]>(
        ["timeline-tasks", deletedTasks.timelineId],
        (old) => {
          if (!old) return old;

          return old.filter((task) => !deletedTasks.taskIds.includes(task.id));
        },
      );

      return { prev };
    },

    onError: (error, variables, context) => {
      toast.error(getErrorMessage(error));
      queryClient.setQueryData(
        ["timeline-tasks", variables.timelineId],
        context?.prev,
      );
    },

    onSuccess: () => {
      toast.success("Tasks deleted");
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["timeline-tasks", variables.timelineId],
      });
    },
  });
};
