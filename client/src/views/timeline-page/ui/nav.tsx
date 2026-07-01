import ColorCodes from "./shared/color-codes";
import CreateRoleBtn from "./shared/create-role-btn";
import CreateTaskBtn from "./shared/create-task-btn";
import DeleteFromTableBtn from "./shared/delete-from-table-btn";

const Nav = () => {
  return (
    <div className="flex justify-between w-full flex-wrap gap-2 md:gap-0">
      <ColorCodes />
      <div className="flex gap-2 ">
        <DeleteFromTableBtn />
        <CreateRoleBtn />
        <CreateTaskBtn />
      </div>
    </div>
  );
};

export default Nav;
