import { Task } from "@/shared/types/bd-types";
import { KanbanTask } from "../ui/canban-widget";
import { ColumnKey, EMPTY_COLUMNS } from "../consts/consts";

export const formatDueDate = (date?: string | Date | null) => {
  if (!date) return undefined;

  const d = new Date(date);

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const transformTasksToColumns = (tasks?: Task[]) => {
  if (!tasks) return EMPTY_COLUMNS;

  const base: Record<ColumnKey, KanbanTask[]> = {
    backlog: [],
    inProgress: [],
    done: [],
  };

  tasks.forEach((task) => {
    const key = task.status as ColumnKey;

    if (!base[key]) base[key] = [];

    base[key].push({
      id: task.id,
      title: task.title,
      priority: task.priority,
      description: task.description ?? undefined,
      assignee: task?.assignee?.name,
      assigneeAvatar: task?.assignee?.image,
      dueDate: formatDueDate(task.dueDate),
    });
  });

  return base;
};
