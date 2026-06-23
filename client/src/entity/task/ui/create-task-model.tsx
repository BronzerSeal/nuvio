"use client";
import { Button } from "@/shared/ui/button";
import { DialogFooter, Modal } from "@/shared/ui/dialog";
import ErrorMsg from "@/shared/ui/error-msg";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import { useParams, useRouter } from "next/navigation";
import { useCreateTask } from "../queries/queries";
import { DueCalendar } from "./due-calendar";
import { PriorityOption, SelectPriority } from "./select-priority";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { authClient } from "@/shared/lib/auth";

interface IFormInput {
  taskName: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
}

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const priorities: PriorityOption[] = [
  // { value: "none", label: "No Priority", variant: "outline" as const },
  // { value: "urgent", label: "Urgent", variant: "destructive" as const },
  { value: "low", label: "Low", variant: "info" },
  { value: "medium", label: "Medium", variant: "warning-light" },
  { value: "high", label: "High", variant: "warning" },
];

export const CreateTaskModal: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const { boardId } = useParams() as { boardId: string | undefined };
  const { data: session } = authClient.useSession();
  const { mutate } = useCreateTask();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "onSubmit",
    defaultValues: {
      priority: "low",
      dueDate: new Date(),
    },
  });

  const onSubmit = async (data: IFormInput) => {
    if (!boardId || !session?.user.id) return;

    const formData = {
      boardId,
      title: data.taskName,
      priority: data.priority,
      assigneeId: session?.user.id,
      dueDate: data.dueDate,
    };

    mutate(formData, {
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
      title="Create task"
      description="Describe your task specifically"
      children={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">task</Label>
              <Input
                id="name-1"
                placeholder="fix bug"
                required
                {...register("taskName", {
                  required: "task name is required",
                })}
              />

              <ErrorMsg error={errors.root?.message} />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DueCalendar onChange={field.onChange} value={field.value} />
                )}
              />

              <div className="flex items-center gap-2 w-full">
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <SelectPriority
                      onChange={field.onChange}
                      options={priorities}
                    />
                  )}
                />

                <Avatar>
                  <AvatarImage
                    src={session?.user.image || undefined}
                    alt="user-avatar"
                  />
                  <AvatarFallback>
                    {session?.user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
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
