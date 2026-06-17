"use client";

import ChooseCompany from "./choose-company";
import { useUserMemberships } from "@/entity/user";

const DashboardPage = () => {
  const { data: userMemberships, isLoading: isUserMembershipsLoading } =
    useUserMemberships();

  const hasCompanies = (userMemberships?.length ?? 0) > 0;
  return (
    <div className="h-full">
      <div className="flex h-full flex-col items-center justify-center">
        {isUserMembershipsLoading && <p>Loading</p>}
        {!isUserMembershipsLoading && !hasCompanies && <ChooseCompany />}
      </div>
    </div>
  );
};

export default DashboardPage;
