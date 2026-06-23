import { KanbanTask } from "../ui/canban-widget";

export const COLUMNS = ["backlog", "inProgress", "done"] as const;

export type ColumnKey = (typeof COLUMNS)[number];

export const EMPTY_COLUMNS = COLUMNS.reduce(
  (acc, key) => {
    acc[key] = [];
    return acc;
  },
  {} as Record<string, KanbanTask[]>,
);
