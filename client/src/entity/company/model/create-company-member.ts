import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const CreateCompanyMember = async (
  companyId: string,
  memberId: string,
  memberRole?: string,
) => {
  const response = await http.post(
    SERVER_ENDPOINTS.company.CompanyMemberships(companyId),
    {
      memberId,
      memberRole,
    },
  );

  return response.data;
};
