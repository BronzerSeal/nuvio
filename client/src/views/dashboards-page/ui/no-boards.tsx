import { Button } from "@/shared/ui/button";
import Lottie from "lottie-react";
import animationData from "../animations/no-data.json";
import React from "react";
import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { useCreateBoard } from "../queries/queries";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import ErrorMsg from "@/shared/ui/error-msg";
import { Company } from "@/shared/types/bd-types";

interface Props {
  currentCompany: Company | undefined;
}

interface IFormInput {
  boardName: string;
}

const NoBoards: React.FC<Props> = ({ currentCompany }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutate } = useCreateBoard();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: IFormInput) => {
    if (!currentCompany?.id) return;

    const formData = {
      boardName: data.boardName,
      companyId: currentCompany.id,
    };

    mutate(formData, {
      onError: (error) => {
        setError("root", {
          type: "server",
          message: getErrorMessage(error),
        });
      },

      onSuccess: () => setIsOpen(false),
    });
  };

  return (
    <>
      <Lottie animationData={animationData} className="h-48 w-48" />
      <h1>No boards yet</h1>
      <Button onClick={() => setIsOpen((prev) => !prev)}>
        Create your first
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogPanel showCloseButton={true} className="sm:max-w-[425px]">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle>Create board</DialogTitle>
              <DialogDescription>
                A interactive place to distribute tasks
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input
                  id="name-1"
                  placeholder="Pixel"
                  required
                  {...register("boardName", {
                    required: "board name is required",
                  })}
                />

                <ErrorMsg error={errors.root?.message} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default NoBoards;
