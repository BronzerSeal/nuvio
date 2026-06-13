import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@shared/ui/button";
import FormInput from "./forms-input";
import { useForm } from "react-hook-form";
import ErrorMsg from "@/shared/ui/error-msg";
import { authClient } from "@/shared/lib/auth";
import { useRouter } from "next/navigation";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";

interface IFormInput {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: IFormInput) => {
    const res = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (res.data?.user.id) {
      router.replace(SITE_ENDPOINTS.dashboards);
    } else {
      setError("root", {
        type: "server",
        message: res.error?.message ?? "Registration failed",
      });
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <FormInput
              placeholder="some@gmail.com"
              label="Email"
              {...register("email", {
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <ErrorMsg error={errors.email?.message} />
          </div>

          <div className="grid gap-2">
            <FormInput
              placeholder="Bob"
              label="Name"
              {...register("name", {
                required: { value: true, message: "Name is required" },
              })}
            />

            <ErrorMsg error={errors.name?.message} />
          </div>

          <div className="grid gap-2">
            <FormInput
              placeholder="123"
              label="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters",
                },
              })}
            />

            <ErrorMsg error={errors.password?.message} />
          </div>

          <div className="grid gap-2">
            <FormInput
              placeholder="123"
              label="Confirm password"
              {...register("confirmPassword", {
                required: true,
                validate: (val: string) => {
                  if (watch("password") != val) {
                    return "Your passwords do no match";
                  }
                },
              })}
            />

            <ErrorMsg error={errors.confirmPassword?.message} />
            <ErrorMsg error={errors.root?.message} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Create</Button>
        </CardFooter>
      </form>
    </>
  );
};

export default RegisterPage;
