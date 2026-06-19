"use client";
import BoardWidget from "@/widgets/canban-widget";
import { useCurrentBoard } from "../queries/queries";
import { useParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { CreateTaskModal } from "@/entity/task";

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

  if (isBoardInfoLoading) return <p className="p-2">Loading</p>;
  if (!boardInfo) return <p className="p-2">Not found or Access denied</p>;
  return (
    <div className="p-2 text-lg font-semibold">
      <h1 className="mb-2">{boardInfo?.name}</h1>
      <Button
        className="w-full mb-5 mt-2"
        onClick={() => setIsCreateTaskOpen((prev) => !prev)}
      >
        Create task
      </Button>

      <BoardWidget />

      <CreateTaskModal
        setIsOpen={setIsCreateTaskOpen}
        isOpen={isCreateTaskOpen}
      />
    </div>
  );
};

export default BoardPage;
