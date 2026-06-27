import { Button } from "@/shared/ui/button";
import { DialogFooter, Modal } from "@/shared/ui/dialog";
import ErrorMsg from "@/shared/ui/error-msg";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import React from "react";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import { useParams, useRouter } from "next/navigation";
import { useCreateTimelineRow } from "../queries/queries";

interface IFormInput {
  rowName: string;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CreateTimelineRowModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
}) => {
  const { mutate } = useCreateTimelineRow();
  const router = useRouter();
  const { timelineId } = useParams() as { timelineId: string | undefined };

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
    if (!timelineId) return;
    const sendData = {
      timelineId,
      rowName: data.rowName,
    };
    mutate(sendData, {
      onError: (error) => {
        setError("root", {
          type: "server",
          message: getErrorMessage(error),
        });
      },
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="New table row"
      children={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="grid gap-3">
              <Label htmlFor="row-name">name</Label>
              <Input
                id="row-name"
                placeholder="frontend"
                required
                {...register("rowName", {
                  required: "row name is required",
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
