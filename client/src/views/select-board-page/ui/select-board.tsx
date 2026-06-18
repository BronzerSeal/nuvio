import { Button } from "@/shared/ui/button";
import Lottie from "lottie-react";
import animationData from "../animation/search.json";
import React from "react";
import { CreateBoardModal } from "@/entity/board/ui/create-board-modal";

const SelectBoard = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Lottie animationData={animationData} className="h-48 w-48" />
      <h1>Choose board from sidebar or create New</h1>
      <Button onClick={() => setIsOpen((prev) => !prev)}>create</Button>

      <CreateBoardModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default SelectBoard;
