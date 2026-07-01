import { Button, FrameButton } from "@/shared/ui/button";
import { DialogFooter, Modal } from "@/shared/ui/dialog";
import ErrorMsg from "@/shared/ui/error-msg";
import { Label } from "@/shared/ui/label";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import {
  useDeleteTimelineRows,
  useDeleteTimelineTasks,
  useTimelineRows,
  useTimelineTasks,
} from "../queries/queries";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import { MultiSelect } from "@/shared/ui/multi-select";

interface IFormInput {
  rowsId: string[];
  tasksId: string[];
}

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DelFromTimelineModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
}) => {
  const { mutate: deleteTimelineRows } = useDeleteTimelineRows();
  const { mutate: deleteTimelineTasks } = useDeleteTimelineTasks();
  const { timelineId } = useParams() as { timelineId: string | undefined };
  const { data: timelineRows } = useTimelineRows(timelineId!, !!timelineId);
  const { data: timelineTasks } = useTimelineTasks(timelineId!, !!timelineId);

  const {
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "onSubmit",
  });

  const handleDeleteRow = async (data: IFormInput) => {
    if (!timelineId) return;

    if (data.rowsId?.length) {
      const sendData = {
        timelineId,
        rowIds: data.rowsId,
      };
      deleteTimelineRows(sendData, {
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
    }

    if (data.tasksId?.length) {
      const sendData = {
        timelineId,
        taskIds: data.tasksId,
      };
      deleteTimelineTasks(sendData, {
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
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Delete something"
      children={
        <form
          onSubmit={handleSubmit(handleDeleteRow)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Rows</Label>
            <Controller
              name="rowsId"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  className="max-w-full"
                  placeholder="select rows..."
                  items={timelineRows ?? []}
                  value={field.value ?? []}
                  onValueChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tasks</Label>
            <Controller
              name="tasksId"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  className="max-w-full"
                  placeholder="select tasks..."
                  items={timelineTasks ?? []}
                  value={field.value ?? []}
                  onValueChange={field.onChange}
                />
              )}
            />
          </div>

          <DialogFooter>
            <div className="flex w-full items-center">
              <ErrorMsg error={errors.root?.message} />

              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <FrameButton
                  type="submit"
                  disabled={isSubmitting}
                  variant="outline"
                  className="text-[10px] size-1"
                >
                  Delete
                </FrameButton>
              </div>
            </div>
          </DialogFooter>
        </form>
      }
    />
  );
};
