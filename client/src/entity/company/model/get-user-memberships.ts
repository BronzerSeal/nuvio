import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import {
  CursorPaginationResponse,
  MembershipWithUser,
} from "@/shared/types/bd-types";

const getCompanyMemberships = async (
  companyId: string,
  cursorId?: string,
): Promise<CursorPaginationResponse<MembershipWithUser>> => {
  const response = await http.get(
    SERVER_ENDPOINTS.company.CompanyMemberships(companyId),
    {
      params: {
        cursorId,
      },
    },
  );

  return response.data;
};

export default getCompanyMemberships;
