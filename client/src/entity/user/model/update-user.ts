import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { UserWithUrls } from "@/shared/types/bd-types";

export const updateUser = async (userData: {
  bio: string;
  name: string;
  email: string;
  urls: { value: string }[];
}): Promise<UserWithUrls> => {
  const response = await http.patch(SERVER_ENDPOINTS.user.updateMe, {
    ...userData,
  });

  return response.data;
};
