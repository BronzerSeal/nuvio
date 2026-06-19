import {
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
} from "@/shared/ui/kanban/kanban";
import { ComponentProps } from "react";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { TaskCard } from "./task-card";
import { Badge } from "@/shared/ui/badge";
import { GripVerticalIcon } from "lucide-react";
import { KanbanTask } from "./canban-widget";

interface TaskColumnProps extends Omit<
  ComponentProps<typeof KanbanColumn>,
  "children"
> {
  tasks: KanbanTask[];
  isOverlay?: boolean;
}

const COLUMN_TITLES: Record<string, string> = {
  backlog: "Backlog",
  inProgress: "In Progress",
  review: "Review",
  done: "Done",
};

export function TaskColumn({
  value,
  tasks,
  isOverlay,
  ...props
}: TaskColumnProps) {
  return (
    <KanbanColumn value={value} {...props}>
      <Card className="mb-2.5">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold">
              {COLUMN_TITLES[value]}
            </span>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>
          <KanbanColumnHandle>
            <Button size="icon-xs" variant="ghost">
              <GripVerticalIcon />
            </Button>
          </KanbanColumnHandle>
        </CardHeader>
        <CardContent>
          <KanbanColumnContent value={value} className="flex flex-col gap-2.5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                asHandle={!isOverlay}
                isOverlay={isOverlay}
              />
            ))}
          </KanbanColumnContent>
        </CardContent>
      </Card>
    </KanbanColumn>
  );
}
