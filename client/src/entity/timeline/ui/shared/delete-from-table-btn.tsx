import { DelFromTimelineModal } from "@/entity/timeline/ui/del-from-timeline-modal";
import { SlideUpButton } from "@/shared/ui/button";
import React from "react";

const DeleteFromTableBtn = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <SlideUpButton
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-[#f33050] text-white p-1 text-sm rounded-sm"
      >
        Delete task/row
      </SlideUpButton>
      <DelFromTimelineModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default DeleteFromTableBtn;
