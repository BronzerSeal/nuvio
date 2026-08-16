import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { UserWithUrls } from "@/shared/types/bd-types";

export const getMe = async (): Promise<UserWithUrls> => {
  const response = await http.get(SERVER_ENDPOINTS.user.findMe);

  return response.data;
};
