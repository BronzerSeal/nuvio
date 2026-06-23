"use client";
import { useCompanyBoards } from "@/entity/board";
import { useParams } from "next/navigation";
import NoBoards from "./no-boards";
import { GlitchLoader } from "@/shared/ui/loader";
import SelectBoard from "./select-board";
import EmptyState from "@/shared/ui/empty-state";

const SelectBoardPage = () => {
  const { companyId } = useParams() as { companyId: string | undefined };

  const {
    data: companyBoards,
    isLoading,
    error,
  } = useCompanyBoards(companyId!, !!companyId);

  const hasBoards = (companyBoards?.length ?? 0) > 0;

  if (error)
    return <EmptyState text="Not found company boards or Access denied" />;
  return (
    <div className="h-full">
      <div className="flex h-full flex-col items-center justify-center">
        {isLoading && <GlitchLoader text="loading" />}
        {!isLoading && !hasBoards && <NoBoards />}
        {!isLoading && hasBoards && <SelectBoard />}
      </div>
    </div>
  );
};

export default SelectBoardPage;
