import { Button } from "@/shared/ui/button";
import { DialogFooter, Modal } from "@/shared/ui/dialog";
import ErrorMsg from "@/shared/ui/error-msg";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useCreateTimelineTask, useTimelineRows } from "../queries/queries";
import { SelectType } from "./select-type";
import { SelectRow } from "./select-row";
import { getErrorMessage } from "@/shared/utils/get-error-msg";

interface IFormInput {
  taskName: string;
  startTime: string;
  duration: string;
  type: "meeting" | "workshop" | "break" | "review";
  rowId: string;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CreateTimelineTaskModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
}) => {
  const { mutate } = useCreateTimelineTask();
  const { timelineId } = useParams() as { timelineId: string | undefined };
  const { data: timelineRows } = useTimelineRows(timelineId!, !!timelineId);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "onSubmit",
    defaultValues: {
      type: "break",
      rowId: timelineRows?.[0]?.id,
    },
  });

  const onSubmit = async (data: IFormInput) => {
    if (!data.rowId) {
      setError("root", {
        type: "client",
        message: "Choose row",
      });
    }

    if (!timelineId) return;
    const sendData = {
      timelineId,
      rowId: data.rowId,
      startTime: data.startTime,
      duration: +data.duration,
      title: data.taskName,
      type: data.type,
      attendees: 1,
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
      title="New task"
      children={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="grid gap-2">
              <Label htmlFor="row-name">name</Label>
              <Input
                id="row-name"
                placeholder="frontend"
                required
                {...register("taskName", {
                  required: "task name is required",
                })}
              />
              <div className="flex flex-row gap-2 ">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="row-name">start time</Label>
                  <Input
                    id="row-name"
                    type="time"
                    required
                    placeholder="00:00"
                    {...register("startTime", {
                      required: "start time is required",
                    })}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <Label htmlFor="row-name">duration</Label>
                  <Input
                    id="row-name"
                    placeholder="60"
                    type="number"
                    required
                    {...register("duration", {
                      required: "duration is required",
                    })}
                  />
                </div>
              </div>

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <SelectType onChange={field.onChange} value={field.value} />
                )}
              />

              <Controller
                name="rowId"
                control={control}
                render={({ field }) => (
                  <SelectRow
                    onChange={field.onChange}
                    value={field.value}
                    rows={timelineRows}
                  />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex w-full items-center">
              <ErrorMsg error={errors.root?.message} />

              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  Create
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      }
    />
  );
};
