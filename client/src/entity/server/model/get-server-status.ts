import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const getServerStatus = async (): Promise<{ status: "ok" }> => {
  const response = await http.get(SERVER_ENDPOINTS.server.serverStatus);

  return response.data;
};
