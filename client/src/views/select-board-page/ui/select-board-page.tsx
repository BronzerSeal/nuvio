"use client";
import { useCompanyBoards } from "@/entity/board";
import { useParams } from "next/navigation";
import NoBoards from "./no-boards";
import { GlitchLoader, SimpleLoader } from "@/shared/ui/loader";

const SelectBoardPage = () => {
  const { companyId } = useParams() as { companyId: string | undefined };

  const { data: companyBoards, isLoading } = useCompanyBoards(
    companyId!,
    !!companyId,
  );
  //   console.log(companyBoards);

  const hasBoards = (companyBoards?.length ?? 0) > 0;
  return (
    <div className="h-full">
      <div className="flex h-full flex-col items-center justify-center">
        {isLoading && <GlitchLoader text="loading" />}
        {!isLoading && !hasBoards && <NoBoards />}
        {!isLoading && hasBoards && (
          <p>Choose board from sidebar or create New</p>
        )}
      </div>
    </div>
  );
};

export default SelectBoardPage;
