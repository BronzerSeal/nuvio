import { KanbanTask } from "../ui/canban-widget";

export function getChangedTasks(
  prev: Record<string, KanbanTask[]>,
  next: Record<string, KanbanTask[]>,
) {
  const changed: Array<{
    taskId: string;
    status: "backlog" | "inProgress" | "done";
    position: number;
  }> = [];

  Object.entries(next).forEach(([status, tasks]) => {
    tasks.forEach((task, index) => {
      const prevStatus = Object.keys(prev).find((column) =>
        prev[column].some((t) => t.id === task.id),
      );

      const prevPosition = prevStatus
        ? prev[prevStatus].findIndex((t) => t.id === task.id)
        : -1;

      if (prevStatus !== status || prevPosition !== index) {
        changed.push({
          taskId: task.id,
          status: status as "backlog" | "inProgress" | "done",
          position: index,
        });
      }
    });
  });

  return changed;
}
