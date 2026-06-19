"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Kanban, KanbanBoard, KanbanOverlay } from "@/shared/ui/kanban";
import { TaskColumn } from "./task-column";
import { useBoardTasks } from "@/entity/board/queries/queries";
import { useParams } from "next/navigation";
import { transformTasksToColumns } from "../model/transformTasks";
import { EMPTY_COLUMNS } from "../consts/consts";
import { useUpdateTask } from "@/entity/task/queries/queries";

export interface KanbanTask {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  description?: string;
  assignee?: string;
  assigneeAvatar?: string;
  dueDate?: string;
}

export default function BoardWidget() {
  const { boardId } = useParams() as { boardId: string | undefined };

  const { data: tasks, isLoading: isColumnsLoading } = useBoardTasks(
    boardId!,
    !!boardId,
  );
  const updateTask = useUpdateTask(boardId ?? "");

  const [columns, setColumns] =
    useState<Record<string, KanbanTask[]>>(EMPTY_COLUMNS);

  useEffect(() => {
    if (!tasks) return;

    setColumns(transformTasksToColumns(tasks));
  }, [tasks]);

  if (isColumnsLoading) return <p>Column Loading</p>;

  return (
    <Kanban
      value={columns}
      onValueChange={(newColumns) => {
        setColumns(newColumns);

        Object.entries(newColumns).forEach(([status, tasks]) => {
          tasks.forEach((task, index) => {
            updateTask.mutate({
              taskId: task.id,
              status: status as any,
              position: index,
            });
          });
        });
      }}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard className="grid auto-rows-fr  grid-cols-1 md:grid-cols-3">
        {Object.entries(columns).map(([columnValue, tasks]) => (
          <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
        ))}
      </KanbanBoard>
      <KanbanOverlay className="bg-muted/10 rounded-md border-2 border-dashed" />
    </Kanban>
  );
}
