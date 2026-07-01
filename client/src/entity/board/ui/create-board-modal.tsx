"use client";
import { Button } from "@/shared/ui/button";
import { DialogFooter, Modal } from "@/shared/ui/dialog";
import ErrorMsg from "@/shared/ui/error-msg";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import React from "react";
import { useCreateBoard } from "../queries/queries";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import { useParams, useRouter } from "next/navigation";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";

interface IFormInput {
  boardName: string;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CreateBoardModal: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const { companyId: currentCompanyId } = useParams() as {
    companyId: string | undefined;
  };
  const { mutate } = useCreateBoard();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: IFormInput) => {
    if (!currentCompanyId) return;

    const formData = {
      boardName: data.boardName,
      companyId: currentCompanyId,
    };

    mutate(formData, {
      onError: (error) => {
        setError("root", {
          type: "server",
          message: getErrorMessage(error),
        });
      },

      onSuccess: (board) => {
        reset();

        router.push(SITE_ENDPOINTS.boards(currentCompanyId, board.id));

        setIsOpen(false);
      },
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create board"
      description="A interactive place to distribute tasks"
      children={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
            <Button type="submit" disabled={isSubmitting}>
              Create
            </Button>
          </DialogFooter>
        </form>
      }
    />
  );
};
