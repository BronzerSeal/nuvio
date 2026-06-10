import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@shared/ui/button";
import FormInput from "./forms-input";
import { useForm } from "react-hook-form";
import ErrorMsg from "./error-msg";
import { authClient } from "@/shared/lib/auth";
import { Separator } from "@/shared/ui/separator";
import GoogleEnter from "@/feature/google-enter";
import { SITE_ENDPOINTS } from "@/shared/config/site-endpoints";
import { useRouter } from "next/navigation";

interface IFormInput {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: IFormInput) => {
    const res = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (res.data?.user.id) {
      router.replace(SITE_ENDPOINTS.dashboards);
    } else {
      setError("root", {
        type: "server",
        message: res.error?.message ?? "login failed",
      });
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
      </CardHeader>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid gap-2">
            <FormInput
              label="Email"
              placeholder="some@gmail.com"
              {...register("email", {
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <ErrorMsg error={errors.email?.message} />

            <FormInput
              type="password"
              label="Password"
              placeholder="123"
              {...register("password", {
                required: "Password is required",
              })}
            />

            <ErrorMsg error={errors.password?.message} />
            <ErrorMsg error={errors.root?.message} />

            <div className="flex items-center w-full">
              <Separator className="flex-1 " />
              <p className="px-3 text-sm text-gray-500">or</p>
              <Separator className="flex-1" />
            </div>

            <GoogleEnter />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Sign In</Button>
        </CardFooter>
      </form>
    </>
  );
};

export default LoginForm;
