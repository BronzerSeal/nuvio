import { Button } from "@/shared/ui/button";
import { DialogFooter, Modal } from "@/shared/ui/dialog";
import ErrorMsg from "@/shared/ui/error-msg";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import React from "react";
import { useJoinOrCreateCompany } from "../queries/queries";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/shared/utils/get-error-msg";
import { COMPANY_ICONS, CompanyIcon } from "../consts/company-icons";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";

interface IFormInput {
  companyName: string;
  companyDescription?: string;
  companyLogo: CompanyIcon;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CreateCompanyModal: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const { mutate } = useJoinOrCreateCompany();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "onSubmit",
    defaultValues: {
      companyLogo: "gallery",
    },
  });

  const onSubmit = async (data: IFormInput) => {
    const sendData = {
      companyName: data.companyName,
      description: data.companyDescription,
      logo: data.companyLogo,
    };

    mutate(sendData, {
      onError: (error) => {
        setError("root", {
          type: "server",
          message: getErrorMessage(error),
        });
      },

      onSuccess: (createdCompany) => {
        reset();
        setIsOpen(false);

        router.push(SITE_ENDPOINTS.companyBoards(createdCompany.companyId));
      },
    });
  };
  const selectedLogo = watch("companyLogo");
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create or Join Company"
      description="New company or already created?"
      children={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
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

              <Label htmlFor="name-1">Company description</Label>
              <Input
                id="name-1"
                placeholder="Pixel"
                {...register("companyDescription")}
              />

              <Label>Choose Company Logo</Label>
              <div className="flex flex-wrap gap-3">
                {Object.entries(COMPANY_ICONS).map(([key, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setValue("companyLogo", key as CompanyIcon, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className={cn(
                      "cursor-pointer rounded-sm border p-3 transition-all",
                      "hover:bg-muted",
                      selectedLogo === key
                        ? "border-primary ring-2 ring-primary/20 bg-muted"
                        : "border-border",
                    )}
                  >
                    <Icon className="size-5" />
                  </button>
                ))}
              </div>

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
      }
    />
  );
};
