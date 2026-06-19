import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../model/create-task";
import { toast } from "sonner";
import { queryClient } from "@/shared/lib/query-client";
import { updateTaskInfo } from "../model/update-task";

export const useCreateTask = () => {
  return useMutation({
    mutationKey: ["create-task"],
    mutationFn: ({
      boardId,
      title,
      priority,
      description,
      assigneeId,
      dueDate,
    }: {
      boardId: string;
      title: string;
      priority?: "low" | "medium" | "high";
      description?: string;
      assigneeId?: string;
      dueDate?: Date;
    }) =>
      createTask(boardId, title, priority, description, assigneeId, dueDate),

    onSuccess: () => {
      toast.success("task created ");
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board-task", variables.boardId],
      });
    },
  });
};

export const useUpdateTask = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-task-info"],

    mutationFn: ({
      taskId,
      position,
      status,
    }: {
      taskId: string;
      position: number;
      status: "backlog" | "inProgress" | "done";
    }) => updateTaskInfo(boardId, taskId, position, status),

    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({
        queryKey: ["board-task", boardId],
      });

      const prev = queryClient.getQueryData(["board-task", boardId]);

      queryClient.setQueryData(["board-task", boardId], (old: any) => {
        if (!old) return old;

        return old.map((task: any) =>
          task.id === updatedTask.taskId
            ? { ...task, status: updatedTask.status }
            : task,
        );
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["board-task", boardId], ctx?.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["board-task", boardId],
      });
    },
  });
};
