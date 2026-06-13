"use client";
import { useQuery } from "@tanstack/react-query";
import { getCompanyBoards } from "../model/get-company-boards";

export const useCompanyBoards = (companyId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["company-boards", companyId],
    queryFn: () => getCompanyBoards(companyId),
    enabled,
  });
};
