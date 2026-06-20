"use client";
import BoardWidget from "@/widgets/canban-widget";
import { Skeleton } from "@/shared/ui/skeleton";
import { useCurrentBoard } from "../queries/queries";
import { useParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { CreateTaskModal } from "@/entity/task";
import EmptyState from "@/shared/ui/empty-state";

const BoardPage = () => {
  const { companyId, boardId } = useParams() as {
    companyId: string | undefined;
    boardId: string | undefined;
  };
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const {
    data: boardInfo,
    isLoading: isBoardInfoLoading,
    error,
  } = useCurrentBoard(boardId!, companyId!, !!boardId && !!companyId);

  console.log(boardInfo, error);

  if (!boardInfo && !isBoardInfoLoading)
    return <EmptyState text="Not found board or Access denied" />;

  return (
    <div className="p-2 text-lg font-semibold">
      {isBoardInfoLoading ? (
        <Skeleton className="h-8 w-1/3 mb-2" />
      ) : (
        <h1 className="mb-2">{boardInfo?.name}</h1>
      )}

      {isBoardInfoLoading ? (
        <Skeleton className="h-10 w-full mb-5 mt-2" />
      ) : (
        <Button
          className="w-full mb-5 mt-2"
          onClick={() => setIsCreateTaskOpen((prev) => !prev)}
        >
          Create task
        </Button>
      )}

      <BoardWidget globalLoading={isBoardInfoLoading} />

      <CreateTaskModal
        setIsOpen={setIsCreateTaskOpen}
        isOpen={isCreateTaskOpen}
      />
    </div>
  );
};

export default BoardPage;
