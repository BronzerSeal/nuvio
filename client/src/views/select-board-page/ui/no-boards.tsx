import { Button } from "@/shared/ui/button";
import Lottie from "lottie-react";
import animationData from "../animation/no-data.json";
import React from "react";
import { CreateBoardModal } from "@/entity/board/ui/create-board-modal";

const NoBoards = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Lottie animationData={animationData} className="h-48 w-48" />
      <h1>No boards yet</h1>
      <Button onClick={() => setIsOpen((prev) => !prev)}>
        Create your first
      </Button>

      <CreateBoardModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default NoBoards;
