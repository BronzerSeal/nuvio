import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FC } from "react";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Input> {
  label: string;
}

const FormInput: FC<Props> = ({ label, name, ...props }) => {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </>
  );
};

export default FormInput;
