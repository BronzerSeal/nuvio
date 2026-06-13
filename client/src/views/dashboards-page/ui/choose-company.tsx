import Lottie from "lottie-react";
import animationData from "../animations/choose-company.json";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import React from "react";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { useForm } from "react-hook-form";
import { useJoinOrCreateCompany } from "../queries/queries";
import ErrorMsg from "@/shared/ui/error-msg";
import { getErrorMessage } from "@/shared/utils/get-error-msg";

interface IFormInput {
  companyName: string;
}

const ChooseCompany = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutate } = useJoinOrCreateCompany();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: IFormInput) => {
    mutate(data.companyName, {
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
      <h1>Create or choose company to start</h1>
      <Button onClick={() => setIsOpen((prev) => !prev)}>Select</Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogPanel showCloseButton={true} className="sm:max-w-[425px]">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle>Create Company</DialogTitle>
              <DialogDescription>
                New company or already created?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Company name</Label>
                <Input
                  id="name-1"
                  placeholder="Pixel"
                  required
                  {...register("companyName", {
                    required: "company name is required",
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

export default ChooseCompany;
