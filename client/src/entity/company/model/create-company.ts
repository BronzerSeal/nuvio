import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { CompanyIcon } from "../consts/company-icons";

export const joinOrCreateCompany = async (
  companyName: string,
  description?: string,
  logo?: CompanyIcon,
) => {
  const response = await http.post(
    SERVER_ENDPOINTS.company.joinOrCreateCompany,
    {
      companyName,
      description,
      logo,
    },
  );

  return response.data;
};
