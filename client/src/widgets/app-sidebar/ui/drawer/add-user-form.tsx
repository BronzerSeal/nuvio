import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

interface IFormInput {
  userNameOrEmail: string;
}

const AddUserFrom = ({
  onSearch,
  onClose,
}: {
  onSearch: (value: string) => void;
  onClose: () => void;
}) => {
  const { register, watch } = useForm<IFormInput>({
    mode: "onChange",
  });

  const value = watch("userNameOrEmail");

  // задержка
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(value || "");
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, onSearch]);

  return (
    <div className="mt-3 space-y-2 px-2">
      <Input placeholder="Email or name" {...register("userNameOrEmail")} />

      <div className="flex justify-between">
        <Button type="button">Invite</Button>

        <Button
          type="button"
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700"
        >
          <X />
        </Button>
      </div>
    </div>
  );
};

export default AddUserFrom;
