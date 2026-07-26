import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const AuthErrorPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const error = searchParams.get("error");

    console.log(error);

    if (error === "account_not_linked") {
      toast.error(
        "This email is already registered. Log in using the method you used to register.",
      );
    } else {
      toast.error("Sign-in failed");
    }

    router.replace("/");
  }, []);

  return null;
};

export default AuthErrorPage;
