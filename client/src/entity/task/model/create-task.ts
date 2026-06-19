import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const createTask = async (
  boardId: string,
  title: string,
  priority?: "low" | "medium" | "high",
  description?: string,
  assigneeId?: string,
  dueDate?: Date,
) => {
  const response = await http.post(SERVER_ENDPOINTS.task.createTask, {
    boardId,
    title,
    priority,
    description,
    assigneeId,
    dueDate,
  });

  return response.data;
};
