import { CompanyIcon } from "@/entity/company";

export type Company = {
  id: string;
  name: string;
  logo: CompanyIcon;
  plan: string;
  createdAt: string;
};

export type Board = {
  companyId: string;
  createdAt: Date;
  id: string;
  name: string;
};

export type Task = {
  id: string;
  assigneeId: string;
  boardId: string;

  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  status: "backlog" | "inProgress" | "done";
  dueDate?: string;

  assignee?: {
    id: string;
    image: string | undefined;
    name: string;
  };

  createdAt: Date;
};

export type BoardWithTasks = Board & {
  tasks: Task[];
};
