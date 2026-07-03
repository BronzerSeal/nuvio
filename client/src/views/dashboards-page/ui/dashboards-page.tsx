"use client";
import { useRouter } from "next/navigation";
import ChooseCompany from "./choose-company";
import { useUserMemberships } from "@/entity/user";
import React from "react";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";

const DashboardPage = () => {
  const router = useRouter();
  const { data: userMemberships, isLoading: isUserMembershipsLoading } =
    useUserMemberships();

  React.useEffect(() => {
    if (isUserMembershipsLoading) return;

    if (userMemberships?.length) {
      router.replace(SITE_ENDPOINTS.companyBoards(userMemberships[0].id));
    }
  }, [isUserMembershipsLoading, userMemberships, router]);

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
