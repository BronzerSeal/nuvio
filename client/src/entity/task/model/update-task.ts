import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const updateTaskInfo = async (
  boardId: string,
  taskId: string,
  position: number,
  status: "backlog" | "inProgress" | "done",
) => {
  const response = await http.patch(SERVER_ENDPOINTS.task.updateTasks(taskId), {
    boardId,
    position,
    status,
  });

  return response.data;
};
