import { CreateTimelineRowModal } from "@/entity/timeline/ui/create-timeline-row-modal";
import { SlideUpButton } from "@/shared/ui/button";
import React from "react";

const CreateRoleBtn = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <SlideUpButton
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-[#5B8FF9] text-white p-1 text-sm rounded-sm"
      >
        Create role
      </SlideUpButton>

      <CreateTimelineRowModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default CreateRoleBtn;
