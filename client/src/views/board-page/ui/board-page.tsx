"use client";
import CanbanBoard from "@/widgets/canban-board";
import { useCurrentBoard } from "../queries/queries";
import { useParams } from "next/navigation";

const BoardPage = () => {
  const { companyId, boardId } = useParams() as {
    companyId: string | undefined;
    boardId: string | undefined;
  };

  const { data: boardInfo, isLoading: isBoardInfoLoading } = useCurrentBoard(
    boardId!,
    companyId!,
    !!boardId && !!companyId,
  );

  console.log(boardInfo);

  if (isBoardInfoLoading) return <p>Loading</p>;
  return (
    <div className="p-2 text-lg font-semibold">
      {boardInfo?.name}
      <CanbanBoard />
    </div>
  );
};

export default BoardPage;
