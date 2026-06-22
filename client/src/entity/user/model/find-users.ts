import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { UserWithMembershipsId } from "@/shared/types/bd-types";

export const getUsers = async (
  userNameOrEmail: string,
  companyId: string,
): Promise<UserWithMembershipsId[]> => {
  const response = await http.get(SERVER_ENDPOINTS.user.findUsers, {
    params: {
      userNameOrEmail,
      companyId,
    },
  });

  return response.data;
};
