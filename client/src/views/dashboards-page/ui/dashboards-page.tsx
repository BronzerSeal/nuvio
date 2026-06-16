"use client";

import ChooseCompany from "./choose-company";
import { useUserMemberships } from "@/entity/user";
import { useRouter } from "next/navigation";
import React from "react";

const DashboardPage = () => {
  const router = useRouter();
  const { data: userMemberships, isLoading: isUserMembershipsLoading } =
    useUserMemberships();

  // const { data: companyBoards, isLoading: iscompanyBoardsLoading } =
  //   useCompanyBoards(currentCompany?.id!, !!currentCompany?.id);

  React.useEffect(() => {
    if (userMemberships?.length) {
      router.push(`/dashboard/${userMemberships[0].id}/boards`);
    }
  }, [userMemberships, router]);

  const hasCompanies = (userMemberships?.length ?? 0) > 0;
  return (
    <div className="h-full">
      <div className="flex h-full flex-col items-center justify-center">
        {isUserMembershipsLoading && <p>Loading</p>}
        {!isUserMembershipsLoading && !hasCompanies && <ChooseCompany />}
        {/* {!hasBoards && hasCompanies && (
          <NoBoards currentCompany={currentCompany} />
        )} */}
      </div>
    </div>
  );
};

export default DashboardPage;
