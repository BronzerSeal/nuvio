import { useCreateCompanyMember } from "@/entity/company/queries/queries";
import { Button } from "@/shared/ui/button";
import { DialogFooter, Modal } from "@/shared/ui/dialog";
import ErrorMsg from "@/shared/ui/error-msg";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AddMemberButton = () => {
  const { mutate } = useCreateCompanyMember();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: IFormInput) => {
    //   const sendData = {
    //     companyName: data.companyName,
    //     description: data.companyDescription,
    //     logo: data.companyLogo,
    //   };
    //   mutate(sendData, {
    //     onError: (error) => {
    //       setError("root", {
    //         type: "server",
    //         message: getErrorMessage(error),
    //       });
    //     },
    //     onSuccess: (createdCompany) => {
    //       reset();
    //       setIsOpen(false);
    //       router.push(SITE_ENDPOINTS.companyBoards(createdCompany.companyId));
    //     },
    //   });
  };
  return (
    <>
      <Button size="sm" onClick={() => setIsOpen((prev) => !prev)}>
        Add member
      </Button>
      <Modal
        open={isOpen}
        onClose={() => {
          // игнорируем outside click
        }}
        title="add user to company"
        description="enter his name or email"
        children={
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
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
    </>
  );
};

export default AddMemberButton;
