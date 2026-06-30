import { CreateTimelineTaskModal } from "@/entity/timeline";
import GridButton from "@/shared/ui/grid-button";
import React from "react";

const CreateTaskBtn = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <GridButton onClick={() => setIsOpen((prev) => !prev)}>
        Create Task
      </GridButton>

      <CreateTimelineTaskModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default CreateTaskBtn;
