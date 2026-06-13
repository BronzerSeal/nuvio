"use client";

import ChooseCompany from "./choose-company";
import { useUserMemberships } from "@/entity/user";
import NoBoards from "./no-boards";
import { useCompanyBoards } from "@/entity/board";

const DashboardPage = () => {
  const { data: userMemberships, isLoading: isUserMembershipsLoading } =
    useUserMemberships();

  const currentCompany = userMemberships?.[0];

  const { data: companyBoards, isLoading: iscompanyBoardsLoading } =
    useCompanyBoards(currentCompany?.id!, !!currentCompany?.id);

  if (isUserMembershipsLoading || iscompanyBoardsLoading) return <p>Loading</p>;

  //юзер уже все создал
  const hasCompanies = (userMemberships?.length ?? 0) > 0;
  const hasBoards = (companyBoards?.length ?? 0) > 0;

  const everythingOkey = hasCompanies && hasBoards;

  return (
    <div className="h-full">
      <div className="flex h-full flex-col items-center justify-center">
        {!hasCompanies && <ChooseCompany />}
        {!hasBoards && hasCompanies && (
          <NoBoards currentCompany={currentCompany} />
        )}

        {everythingOkey && <p>HII</p>}
      </div>
    </div>
  );
};

export default DashboardPage;
